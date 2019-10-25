import { Success, Failure } from "../../validation";
import { Validator, validate } from "../../validator";
import { field, shape, items, stopOnFirstFailure, concatFailure, when, fromModel, logTo, filterFields } from "../index";
import ValidationError from "../../validationError";
import Reader from "@totalsoft/zion/data/reader";

describe("stopOnFirstFailure validator:", () => {
  it("returns success when all return success: ", () => {
    // Arrange
    const nameValidator = Validator.of(Success);
    const minLengthValidator = Validator.of(Success);
    const model = "";

    const validator = stopOnFirstFailure(nameValidator, minLengthValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toBe(Success);
  });

  it("return failure when all return failure: ", () => {
    // Arrange
    const nameValidator = _ => Failure(ValidationError("Wrong"));
    const maxLengthValidator = jest.fn(_ => Failure(ValidationError("Too long")));
    const model = "testWrong";

    const validator = stopOnFirstFailure(Validator(nameValidator), Validator(maxLengthValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError("Wrong")));
    expect(maxLengthValidator.mock.calls.length).toBe(0);
  });
});

describe("concatFailure validator:", () => {
  it("returns failure when all return failure: ", () => {
    // Arrange
    const nameValidator = Validator.of(Failure(ValidationError("Wrong")));
    const maxLengthValidator = Validator.of(Failure(ValidationError("Too long")));
    const model = "";

    const validator = concatFailure(nameValidator, maxLengthValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(["Wrong", "Too long"])));
  });
});

describe("when validator:", () => {
  it("returns failure when predicate returns true and inner validator returns failure:", () => {
    // Arrange
    const nameValidator = Validator.of(Failure(ValidationError("Wrong")));
    const model = "testWrong";
    const validator = when(_ => true, nameValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError("Wrong")));
  });

  it("returns succes when predicate returns false and inner validator returns failure:", () => {
    // Arrange
    const nameValidator = Validator.of(Failure(ValidationError("Wrong")));
    const model = "testWrong";
    const validator = when(_ => false, nameValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toBe(Success);
  });

  it("returns inner validator when predicate is boolean true:", () => {
    // Arrange
    const model = "testWrong";
    const innerValidation = Failure(ValidationError("Wrong"));
    const innerValidator = Validator.of(innerValidation);
    const whenValidator = when(true, innerValidator);

    // Act
    const whenValidation = model |> validate(whenValidator);

    // Assert
    expect(whenValidation).toBe(innerValidation);
  });

  it("returns success when predicate is boolean false:", () => {
    // Arrange
    const model = "testWrong";
    const innerValidation = Failure(ValidationError("Wrong"));
    const innerValidator = Validator.of(innerValidation);
    const whenValidator = when(false, innerValidator);

    // Act
    const whenValidation = model |> validate(whenValidator);

    // Assert
    expect(whenValidation).toBe(Success);
  });

  it("returns inner validator when predicate is Reader of boolean true:", () => {
    // Arrange
    const model = "testWrong";
    const innerValidation = Failure(ValidationError("Wrong"));
    const innerValidator = Validator.of(innerValidation);
    const whenValidator = when(Reader.of(true), innerValidator);

    // Act
    const whenValidation = model |> validate(whenValidator);

    // Assert
    expect(whenValidation).toBe(innerValidation);
  });

  it("returns success when predicate is Reader of boolean false:", () => {
    // Arrange
    const model = "testWrong";
    const innerValidation = Failure(ValidationError("Wrong"));
    const innerValidator = Validator.of(innerValidation);
    const whenValidator = when(Reader.of(false), innerValidator);

    // Act
    const whenValidation = model |> validate(whenValidator);

    // Assert
    expect(whenValidation).toBe(Success);
  });
});

describe("single field validator:", () => {
  it("returns success when field validator returns success: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Success);
    const model = { field1: "test" };
    const validator = field("field1", fieldValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("returns failure when field validator returns failure: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Failure(ValidationError("Wrong")));
    const model = { field1: "testWrong" };
    const validator = field("field1", fieldValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError([], { field1: ValidationError("Wrong") })));
  });

  it("returns failure when field not exists: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Failure(ValidationError("Wrong")));
    const model = {};
    const validator = field("field1", fieldValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError([], { field1: ValidationError("Wrong") })));
  });
});

describe("shape validator:", () => {
  it("returns success when single field validator returns success: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Success);
    const model = { field1: "test" };
    const validator = shape({ field1: fieldValidator });

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("returns failure when single field validator returns failure: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Failure(ValidationError("Wrong")));
    const model = { field1: "testWrong" };
    const validator = shape({ field1: fieldValidator });

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError([], { field1: ValidationError("Wrong") })));
  });

  it("returns failure when used with path predicate - predicate false ", () => {
    // Arrange
    const nameValidator = jest.fn(_ => Failure(ValidationError("Wrong")));
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
    expect(validation).toBe(Success);
    expect(nameValidator.mock.calls.length).toBe(0);
  });
});

describe("items validators:", () => {
  it("returns success when item validator returns success: ", () => {
    // Arrange
    const itemValidator = Validator.of(Success);
    const model = ["test"];
    const validator = items(itemValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("returns failure when item validator returns failure: ", () => {
    // Arrange
    const itemValidator = Validator.of(Failure(ValidationError("Wrong")));
    const model = ["testWrong"];
    const validator = items(itemValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError([], { ["0"]: ValidationError("Wrong") })));
  });
});

describe("fromModel validator:", () => {
  it("success: ", () => {
    // Arrange
    const maxLengthValidator = length => Validator(x => (x.length <= length ? Success : Failure(ValidationError("Too long"))));
    const model = {
      maxLength: 4,
      name: "test"
    };
    const validator = fromModel(model => shape({ name: maxLengthValidator(model.maxLength) }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("failure: ", () => {
    // Arrange
    const maxLengthValidator = length => Validator(x => (x.length <= length ? Success : Failure(ValidationError("Too long"))));
    const model = {
      maxLength: 3,
      name: "test"
    };
    const validator = fromModel(model => shape({ name: maxLengthValidator(model.maxLength) }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError([], { name: ValidationError("Too long") })));
  });
});

describe("utility validators:", () => {
  it("dirtyFieldsOnly with logTo validator", () => {
    // Arrange
    const nameValidator = jest.fn(_ => Failure("Wrong"));
    const surnameValidator = jest.fn(_ => Success);
    const logger = { log: jest.fn(_ => {}) };
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
    expect(validation).toBe(Success);
    expect(nameValidator.mock.calls.length).toBe(0);
    expect(surnameValidator.mock.calls.length).toBe(1);
  });

  it("dirtyFieldsOnly on collection with logTo validator", () => {
    // Arrange
    const nameValidator = jest.fn(_ => Failure(ValidationError("Wrong")));
    const surnameValidator = jest.fn(_ => Success);
    const logger = { log: jest.fn(_ => {}) };
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
    expect(validation).toBe(Success);

    expect(nameValidator.mock.calls.length).toBe(0);
    expect(surnameValidator.mock.calls.length).toBe(2);
    expect(logger.log.mock.calls.length).toBe(5);
  });
});
