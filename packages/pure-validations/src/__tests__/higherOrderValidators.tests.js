import { Validation } from "../validation";
import { Validator, validate } from "../validator";
import { field, shape, items, all, any, when, fromModel, logTo, filterFields, abortEarly } from "../higherOrderValidators";

describe("boolean and shorcircuit validators:", () => {
  it("all validators success: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Success());
    const minLengthValidator = Validator.of(Validation.Success());
    const model = "";

    const validator = all(nameValidator, minLengthValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toBe(Validation.Success());
  });

  it("all validators fail: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Failure(["Wrong"]));
    const maxLengthValidator = Validator.of(Validation.Failure(["Too long"]));
    const model = "";

    const validator = all(nameValidator, maxLengthValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation.value).toStrictEqual(Validation.Failure(["Wrong", "Too long"]).value);
  });

  it("any validators success - fail first: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Failure(["Wrong"]));
    const minLengthValidator = Validator.of(Validation.Success());
    const model = "";

    const validator = any(nameValidator, minLengthValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toEqual(Validation.Success());
  });

  it("any validators success - fail second: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Success());
    const secondFn = jest.fn(_ => Validation.Failure(["Too short"]));
    const minLengthValidator = Validator(secondFn);
    const model = "";

    const validator = any(nameValidator, minLengthValidator) |> abortEarly;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toEqual(Validation.Success());

    //TBD: No short circuit for any
    expect(secondFn.mock.calls.length).toBe(0);
  });

  it("any validators fail: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Failure(["Wrong"]));
    const maxLengthValidator = Validator.of(Validation.Failure(["Too long"]));
    const model = "";

    const validator = any(nameValidator, maxLengthValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure(["Wrong", "Too long"]));
  });

  it("stop on first failure validators success: ", () => {
    // Arrange
    const nameValidator = jest.fn(_ => Validation.Success());
    const minLengthValidator = jest.fn(_ => Validation.Success());
    const model = "test";

    const validator = all(Validator(nameValidator), Validator(minLengthValidator)) |> abortEarly;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toBe(Validation.Success());
    expect(nameValidator.mock.calls.length).toBe(1);
    expect(minLengthValidator.mock.calls.length).toBe(1);
  });

  it("stop on first failure validators fail: ", () => {
    // Arrange
    const nameValidator = _ => Validation.Failure(["Wrong"]);
    const maxLengthValidator = jest.fn(_ => Validation.Failure(["Too long"]));
    const model = "testWrong";

    const validator = all(Validator(nameValidator), Validator(maxLengthValidator)) |> abortEarly;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure(["Wrong"]));
    expect(maxLengthValidator.mock.calls.length).toBe(0);
  });
});

describe("conditional validators:", () => {
  it("when predicate validator - predicate true ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Failure(["Wrong"]));
    const model = "testWrong";
    const validator = when(x => x !== null, nameValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure(["Wrong"]));
  });

  it("when predicate validator - predicate false ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Failure(["Wrong"]));
    const model = "testWrong";
    const validator = when(x => x === null, nameValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toBe(Validation.Success());
  });
});

describe("single field validator:", () => {
  it("single field validator success: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Validation.Success());
    const model = { field1: "test" };
    const validator = field("field1", fieldValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Success({ field1: Validation.Success() }));
  });

  it("single field validator error: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Validation.Failure(["Wrong"]));
    const model = { field1: "testWrong" };
    const validator = field("field1", fieldValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { field1: Validation.Failure(["Wrong"]) }));
  });
});

describe("fields validators:", () => {
  it("fields validator success: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Validation.Success());
    const model = { field1: "test" };
    const validator = shape({ field1: fieldValidator });

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Success({ field1: Validation.Success() }));
  });

  it("fields validator error: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Validation.Failure(["Wrong"]));
    const model = { field1: "testWrong" };
    const validator = shape({ field1: fieldValidator });

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { field1: Validation.Failure(["Wrong"]) }));
  });

  it("both global and fields validators success: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Validation.Success());
    const globalValidator = Validator.of(Validation.Success());
    const model = { email: "test" };

    const validator = all(globalValidator, shape({ email: fieldValidator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Success({ email: Validation.Success() }));
  });

  it("both global and fields validators - fail field: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Validation.Failure(["Wrong"]));
    const globalValidator = Validator.of(Validation.Success());

    const model = { email: "testWrong" };

    const validator = all(globalValidator, shape({ email: fieldValidator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { email: Validation.Failure(["Wrong"]) }));
  });

  it("both global and fields validators - fail global: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Validation.Success());
    const globalValidator = Validator.of(Validation.Failure(["Mandatory"]));
    const model = {};

    const validator = all(globalValidator, shape({ email: fieldValidator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure(["Mandatory"]));
  });

  it("disjunct fileds validators success: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Success());
    const emailValdator = Validator.of(Validation.Success());

    const model = {
      name: "test",
      email: "test@mail.com"
    };

    const validator = all(shape({ name: nameValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(
      Validation.Success({
        name: Validation.Success(),
        email: Validation.Success()
      })
    );
  });

  it("disjunct fields validators failure - fail first: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Failure(["Too short"]));
    const emailValdator = Validator.of(Validation.Success());

    const model = {
      name: "t",
      email: "test@mail.com"
    };

    const validator = all(shape({ name: nameValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(
      Validation.Failure([], {
        name: Validation.Failure(["Too short"])
      })
    );
  });

  it("disjunct fields validators failure - fail second: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Success());
    const emailValdator = Validator.of(Validation.Failure(["Invalid email"]));

    const model = {
      name: "test",
      email: "testmail.com"
    };

    const validator = all(shape({ name: nameValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(
      Validation.Failure([], {
        email: Validation.Failure(["Invalid email"])
      })
    );
  });

  it("disjunct fields validators failure - fail both: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Failure(["Too short"]));
    const emailValdator = Validator.of(Validation.Failure(["Invalid email"]));

    const model = {
      name: "t",
      email: "testmail.com"
    };

    const validator = all(shape({ name: nameValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(
      Validation.Failure([], {
        name: Validation.Failure(["Too short"]),
        email: Validation.Failure(["Invalid email"])
      })
    );
  });

  it("overlapping fields validators success: ", () => {
    // Arrange
    const lengthValidator = Validator.of(Validation.Success());
    const emailValdator = Validator.of(Validation.Success());
    const model = { email: "test@mail.com" };

    const validator = all(shape({ email: lengthValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toMatchObject(Validation.Success({ email: Validation.Success() }));
  });

  it("overlapping fields validators - fail first: ", () => {
    // Arrange
    const lengthValidator = Validator.of(Validation.Failure(["Too short"]));
    const emailValdator = Validator.of(Validation.Success());
    const model = { email: "t@b.c" };

    const validator = all(shape({ email: lengthValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { email: Validation.Failure(["Too short"]) }));
  });

  it("overlapping fields validators failure - fail second: ", () => {
    // Arrange
    const lengthValidator = Validator.of(Validation.Success());
    const emailValdator = Validator.of(Validation.Failure(["Invalid email"]));
    const model = { email: "testmail.com" };

    const validator = all(shape({ email: lengthValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { email: Validation.Failure(["Invalid email"]) }));
  });

  it("overlapping fields validators failure - fail both: ", () => {
    // Arrange
    const lengthValidator = Validator.of(Validation.Failure(["Too short"]));
    const emailValdator = Validator.of(Validation.Failure(["Invalid email"]));
    const model = { email: "t" };

    const validator = all(shape({ email: lengthValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { email: Validation.Failure(["Too short", "Invalid email"]) }));
  });

  it("fields validator with path predicate - predicate false ", () => {
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

    function getInnerProp(obj) {
      return function(searchKeyPath) {
        const [prop, ...rest] = searchKeyPath;
        return prop !== undefined ? getInnerProp(obj[prop])(rest) : obj;
      };
    }

    const validator =
      shape({
        child: shape({
          name: Validator(nameValidator)
        })
      }) |> filterFields(getInnerProp(dirtyInfo));

    // Act
    const validation = validate(validator, model);

    // Assert
    expect(validation).toBe(Validation.Success());
    expect(nameValidator.mock.calls.length).toBe(0);
  });
});

describe("items validators:", () => {
  it("items validator success: ", () => {
    // Arrange
    const itemValidator = Validator.of(Validation.Success());
    const model = ["test"];
    const validator = items(itemValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Success({ ["0"]: Validation.Success() }));
  });

  it("items validator error: ", () => {
    // Arrange
    const itemValidator = Validator.of(Validation.Failure(["Wrong"]));
    const model = ["testWrong"];
    const validator = items(itemValidator);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { ["0"]: Validation.Failure(["Wrong"]) }));
  });

  it("both global and items validators success: ", () => {
    // Arrange
    const itemValidator = Validator.of(Validation.Success());
    const globalValidator = Validator.of(Validation.Success());
    const model = ["test"];

    const validator = all(globalValidator, items(itemValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Success({ ["0"]: Validation.Success() }));
  });

  it("both global and items validators - fail item: ", () => {
    // Arrange
    const itemValidator = Validator.of(Validation.Failure(["Wrong"]));
    const globalValidator = Validator.of(Validation.Success());
    const model = ["testWrong"];

    const validator = all(globalValidator, items(itemValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { ["0"]: Validation.Failure(["Wrong"]) }));
  });

  it("both global and items validators - fail global: ", () => {
    // Arrange
    const itemValidator = Validator.of(Validation.Success());
    const globalValidator = Validator.of(Validation.Failure(["Empty"]));
    const model = [];

    const validator = all(globalValidator, items(itemValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure(["Empty"]));
  });

  it("overlapping items validators success: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Success());
    const minLengthValidator = Validator.of(Validation.Success());
    const model = ["test"];

    const validator = all(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Success({ ["0"]: Validation.Success() }));
  });

  it("overlapping items validators - fail first: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Failure(["Wrong"]));
    const minLengthValidator = Validator.of(Validation.Success());
    const model = ["test"];

    const validator = all(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { ["0"]: Validation.Failure(["Wrong"]) }));
  });

  it("overlapping items validators failure - fail second: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Success());
    const minLengthValidator = Validator.of(Validation.Failure(["Too short"]));
    const model = ["test"];

    const validator = all(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { ["0"]: Validation.Failure(["Too short"]) }));
  });

  it("overlapping items validators failure - fail both: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Failure(["Wrong"]));
    const minLengthValidator = Validator.of(Validation.Failure(["Too short"]));
    const model = ["t"];

    const validator = all(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { ["0"]: Validation.Failure(["Wrong", "Too short"]) }));
  });

  it("items validator - fail only one item", () => {
    // Arrange
    const nameValidator = Validator(m => (m == "test" ? Validation.Success() : Validation.Failure(["Wrong"])));
    const minLengthValidator = Validator.of(Validation.Success());
    const model = ["test", "testWrong"];

    const validator = all(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(
      Validation.Failure([], {
        ["1"]: Validation.Failure(["Wrong"])
      })
    );
  });
});

describe("model validators:", () => {
  it("model validator success: ", () => {
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

  it("model validator error: ", () => {
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
    expect(validation).toStrictEqual(Validation.Failure([], { name: Validation.Failure(["Too long"]) }));
  });
});

describe("utility validators:", () => {
  it("dirtyFieldsOnly with logTo validator", () => {
    // Arrange
    const nameValidator = jest.fn(_ => Validation.Failure(["Wrong"]));
    const surnameValidator = jest.fn(_ => Validation.Success());
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

    function getInnerProp(obj) {
      return function(searchKeyPath) {
        const [prop, ...rest] = searchKeyPath;
        return prop !== undefined ? getInnerProp(obj[prop])(rest) : obj;
      };
    }

    // Act
    const decoratedValidator = validator |> filterFields(getInnerProp(dirtyInfo)) |> logTo(logger);

    const validation = model |> validate(decoratedValidator);

    // Assert
    expect(validation).toBe(Validation.Success());
    expect(nameValidator.mock.calls.length).toBe(0);
    expect(surnameValidator.mock.calls.length).toBe(1);
  });

  it("dirtyFieldsOnly on collection with logTo validator", () => {
    // Arrange
    const nameValidator = jest.fn(_ => Validation.Failure(["Wrong"]));
    const surnameValidator = jest.fn(_ => Validation.Success());
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

    function getInnerProp(obj) {
      return function(searchKeyPath) {
        const [prop, ...rest] = searchKeyPath;
        return prop !== undefined ? getInnerProp(obj[prop])(rest) : obj;
      };
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
    const decoratedValidator = validator |> filterFields(getInnerProp(dirtyInfo)) |> logTo(logger);

    const validation = model |> validate(decoratedValidator);

    // Assert
    expect(validation).toBe(Validation.Success());

    expect(nameValidator.mock.calls.length).toBe(0);
    expect(surnameValidator.mock.calls.length).toBe(2);
    expect(logger.log.mock.calls.length).toBe(5);
  });
});
