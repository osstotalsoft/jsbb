import { Validation } from "../../validation";
import { Validator, validate } from "../../validator";
import { field, shape, items, stopOnFirstFailure, concatFailure, when, fromModel, logTo, filterFields } from "../index";
import ValidationError from "../../validationError";

describe("stopOnFirstFailure validator:", () => {
  it("returns success when all return success: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Success());
    const minLengthValidator = Validator.of(Validation.Success());
    const model = "";

    const validator = stopOnFirstFailure(nameValidator, minLengthValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toBe(Validation.Success());
  });

  it("return failure when all return failure: ", () => {
    // Arrange
    const nameValidator = _ => Validation.Failure(["Wrong"]);
    const maxLengthValidator = jest.fn(_ => Validation.Failure(["Too long"]));
    const model = "testWrong";

    const validator = stopOnFirstFailure(Validator(nameValidator), Validator(maxLengthValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure(["Wrong"]));
    expect(maxLengthValidator.mock.calls.length).toBe(0);
  });
})

describe("concatFailure validator:", () => {
  it("returns failure when all return failure: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Failure(["Wrong"]));
    const maxLengthValidator = Validator.of(Validation.Failure(["Too long"]));
    const model = "";

    const validator = concatFailure(nameValidator, maxLengthValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure(["Wrong", "Too long"]));
  });
})

describe("when validator:", () => {
  it("returns failure when predicate returns true and inner validator returns failure:", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Failure(["Wrong"]));
    const model = "testWrong";
    const validator = when(_ => true, nameValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure(["Wrong"]));
  });

  it("returns succes when predicate returns false and inner validator returns failure:", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Failure(["Wrong"]));
    const model = "testWrong";
    const validator = when(_ => false, nameValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toBe(Validation.Success());
  });
});

describe("single field validator:", () => {
  it("returns success when field validator returns success: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Validation.Success());
    const model = { field1: "test" };
    const validator = field("field1", fieldValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("returns failure when field validator returns failure: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Validation.Failure(["Wrong"]));
    const model = { field1: "testWrong" };
    const validator = field("field1", fieldValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { field1: ValidationError(["Wrong"]) }));
  });

  it("returns failure when field not exists: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Validation.Failure(["Wrong"]));
    const model = {};
    const validator = field("field1", fieldValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { field1: ValidationError(["Wrong"]) }));
  });
});

describe("shape validator:", () => {
  it("returns success when single field validator returns success: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Validation.Success());
    const model = { field1: "test" };
    const validator = shape({ field1: fieldValidator });

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("returns failure when single field validator returns failure: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Validation.Failure(["Wrong"]));
    const model = { field1: "testWrong" };
    const validator = shape({ field1: fieldValidator });

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { field1: ValidationError(["Wrong"]) }));
  });

  it("returns failure when used with path predicate - predicate false ", () => {
    // Arrange
    const nameValidator = jest.fn(_ => Validation.Failure(["Wrong"]));
    const model = {
      child: {
        name: "testWrong"
      }
    };

    const dirtyInfo = {
      child: {
        name: false
      }
    };

    function getInnerProp(context) {
      function inner(obj, searchKeyPath) {
        const [prop, ...rest] = searchKeyPath;
        return prop !== undefined ? inner(obj[prop], rest) : obj;
      }

      return inner(context.dirtyInfo, context.fieldPath) ? true : false;
    }

    const validator =
      shape({
        child: shape({
          name: Validator(nameValidator)
        })
      }) |> filterFields(getInnerProp);

    // Act
    const validation = validate(validator, model, { dirtyInfo });

    // Assert
    expect(validation).toBe(Validation.Success());
    expect(nameValidator.mock.calls.length).toBe(0);
  });
});

describe("items validators:", () => {
  it("returns success when item validator returns success: ", () => {
    // Arrange
    const itemValidator = Validator.of(Validation.Success());
    const model = ["test"];
    const validator = items(itemValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Success({ ["0"]: Validation.Success() }));
  });

  it("returns failure when item validator returns failure: ", () => {
    // Arrange
    const itemValidator = Validator.of(Validation.Failure(["Wrong"]));
    const model = ["testWrong"];
    const validator = items(itemValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { ["0"]: ValidationError(["Wrong"]) }));
  });
});

describe("fromModel validator:", () => {
  it("success: ", () => {
    // Arrange
    const maxLengthValidator = length => Validator(x => (x.length <= length ? Validation.Success() : Validation.Failure(["Too long"])));
    const model = {
      maxLength: 4,
      name: "test"
    };
    const validator = fromModel(model => shape({ name: maxLengthValidator(model.maxLength) }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Success({ name: Validation.Success() }));
  });

  it("failure: ", () => {
    // Arrange
    const maxLengthValidator = length => Validator(x => (x.length <= length ? Validation.Success() : Validation.Failure(["Too long"])));
    const model = {
      maxLength: 3,
      name: "test"
    };
    const validator = fromModel(model => shape({ name: maxLengthValidator(model.maxLength) }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { name: ValidationError(["Too long"]) }));
  });
});

describe("utility validators:", () => {
  it("dirtyFieldsOnly with logTo validator", () => {
    // Arrange
    const nameValidator = jest.fn(_ => Validation.Failure(["Wrong"]));
    const surnameValidator = jest.fn(_ => Validation.Success());
    const logger = { log: jest.fn(_ => { }) };
    const model = {
      child: {
        name: "testWrong",
        surname: "good"
      }
    };

    const dirtyInfo = {
      child: {
        name: false,
        surname: true
      }
    };

    const validator = shape({
      child: shape({
        name: Validator(nameValidator),
        surname: Validator(surnameValidator)
      })
    });

    function getInnerProp(context) {
      function inner(obj, searchKeyPath) {
        const [prop, ...rest] = searchKeyPath;
        return prop !== undefined ? inner(obj[prop], rest) : obj;
      }

      return inner(context.dirtyInfo, context.fieldPath) ? true : false;
    }

    // Act
    const decoratedValidator = validator |> filterFields(getInnerProp) |> logTo(logger);

    const validation = validate(decoratedValidator, model, { dirtyInfo });

    // Assert
    expect(validation).toBe(Validation.Success());
    expect(nameValidator.mock.calls.length).toBe(0);
    expect(surnameValidator.mock.calls.length).toBe(1);
  });

  it("dirtyFieldsOnly on collection with logTo validator", () => {
    // Arrange
    const nameValidator = jest.fn(_ => Validation.Failure(["Wrong"]));
    const surnameValidator = jest.fn(_ => Validation.Success());
    const logger = { log: jest.fn(_ => { }) };
    const model = {
      children: [
        {
          name: "testWrong",
          surname: "good"
        },
        {
          name: "test",
          surname: "good"
        }
      ]
    };

    const dirtyInfo = {
      children: {
        "0": {
          name: false,
          surname: true
        },
        "1": {
          name: false,
          surname: true
        }
      }
    };

    function getInnerProp(context) {
      function inner(obj, searchKeyPath) {
        const [prop, ...rest] = searchKeyPath;
        return prop !== undefined ? inner(obj[prop], rest) : obj;
      }

      return inner(context.dirtyInfo, context.fieldPath) ? true : false;
    }

    const validator = shape({
      children: items(
        shape({
          name: Validator(nameValidator),
          surname: Validator(surnameValidator)
        })
      )
    });

    // Act
    const decoratedValidator = validator |> filterFields(getInnerProp) |> logTo(logger);

    const validation = validate(decoratedValidator, model, { dirtyInfo });

    // Assert
    expect(validation).toBe(Validation.Success());

    expect(nameValidator.mock.calls.length).toBe(0);
    expect(surnameValidator.mock.calls.length).toBe(2);
    expect(logger.log.mock.calls.length).toBe(5);
  });
});
