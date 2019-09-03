// @flow
import { Validation } from "../validation";
import { fields, items, all, any, when, first, withModel, dirtyFieldsOnly, debug } from "../higherOrderValidators";
import flow from "lodash.flow";

describe("boolean and shorcircuit validators:", () => {
  it("all validators success: ", () => {
    // Arrange
    const nameValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const minLengthValidator = x => (x.length > 3 ? Validation.Success() : Validation.Failure(["Too short"]));
    const model = "test";

    const validator = all(nameValidator, minLengthValidator);

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toBe(Validation.Success());
  });

  it("all validators fail: ", () => {
    // Arrange
    const nameValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const maxLengthValidator = x => (x.length < 5 ? Validation.Success() : Validation.Failure(["Too long"]));
    const model = "testWrong";

    const validator = all(nameValidator, maxLengthValidator);

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure(["Wrong", "Too long"]));
  });

  it("any validators success - fail first: ", () => {
    // Arrange
    const nameValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const minLengthValidator = x => (x.length > 4 ? Validation.Success() : Validation.Failure(["Too short"]));
    const model = "testWrong";

    const validator = any(nameValidator, minLengthValidator);

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toBe(Validation.Success());
  });

  it("any validators success - fail second: ", () => {
    // Arrange
    const nameValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const minLengthValidator = jest.fn(x => (x.length > 4 ? Validation.Success() : Validation.Failure(["Too short"])));
    const model = "test";

    const validator = any(nameValidator, minLengthValidator);

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toBe(Validation.Success());
    expect(minLengthValidator.mock.calls.length).toBe(0);
  });

  it("any validators fail: ", () => {
    // Arrange
    const nameValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const maxLengthValidator = x => (x.length < 5 ? Validation.Success() : Validation.Failure(["Too long"]));
    const model = "testWrong";

    const validator = any(nameValidator, maxLengthValidator);

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure(["Wrong", "Too long"]));
  });

  it("stop on first failure validators success: ", () => {
    // Arrange
    const nameValidator = jest.fn(x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"])));
    const minLengthValidator = jest.fn(x => (x.length > 3 ? Validation.Success() : Validation.Failure(["Too short"])));
    const model = "test";

    const validator = first(nameValidator, minLengthValidator);

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toBe(Validation.Success());
    expect(nameValidator.mock.calls.length).toBe(1);
    expect(minLengthValidator.mock.calls.length).toBe(1);
  });

  it("stop on first failure validators fail: ", () => {
    // Arrange
    const nameValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const maxLengthValidator = jest.fn(x => (x.length < 3 ? Validation.Success() : Validation.Failure(["Too long"])));
    const model = "testWrong";

    const validator = first(nameValidator, maxLengthValidator);

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure(["Wrong"]));
    expect(maxLengthValidator.mock.calls.length).toBe(0);
  });
});

describe("conditional validators:", () => {
  it("when predicate validator - predicate true ", () => {
    // Arrange
    const nameValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const model = "testWrong";
    const validator = when(x => x !== null, nameValidator);

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure(["Wrong"]));
  });

  it("when predicate validator - predicate false ", () => {
    // Arrange
    const nameValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const model = "testWrong";
    const validator = when(x => x === null, nameValidator);

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });
});

describe("field validators:", () => {
  it("field validator success: ", () => {
    // Arrange
    const fieldValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const model = { field1: "test" };
    const validator = fields({ field1: fieldValidator });

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toBe(Validation.Success());
  });

  it("field validator error: ", () => {
    // Arrange
    const fieldValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const model = { field1: "testWrong" };
    const validator = fields({ field1: fieldValidator });

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { field1: Validation.Failure(["Wrong"]) }));
  });

  it("both global and field validators success: ", () => {
    // Arrange
    const fieldValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const globalValidator = x => (x !== null ? Validation.Success() : Validation.Failure(["Mandatory"]));
    const model = { email: "test" };

    const validator = all(globalValidator, fields({ email: fieldValidator }));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toBe(Validation.Success());
  });

  it("both global and field validators - fail field: ", () => {
    // Arrange
    const fieldValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const globalValidator = x => (x !== null ? Validation.Success() : Validation.Failure(["Mandatory"]));

    const model = { email: "testWrong" };

    const validator = all(globalValidator, fields({ email: fieldValidator }));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { email: Validation.Failure(["Wrong"]) }));
  });

  it("both global and field validators - fail global: ", () => {
    // Arrange
    const fieldValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const globalValidator = x => (Object.keys(x).length ? Validation.Success() : Validation.Failure(["Mandatory"]));
    const model = {};

    const validator = all(globalValidator, fields({ email: fieldValidator }));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure(["Mandatory"]));
  });

  it("disjunct filed validators success: ", () => {
    // Arrange
    const nameValidator = (x: string) => (x.length > 3 ? Validation.Success() : Validation.Failure(["Too short"]));
    const emailValdator = (x: string) => (x.includes("@") ? Validation.Success() : Validation.Failure(["Invalid email"]));

    const obj = {
      name: "test",
      email: "test@mail.com"
    };

    const validator = all(fields({ name: nameValidator }), fields({ email: emailValdator }));

    // Act
    const validation = validator(obj);

    // Assert
    expect(validation).toBe(Validation.Success());
  });

  it("disjunct filed validators failure - fail first: ", () => {
    // Arrange
    const nameValidator = x => (x.length > 3 ? Validation.Success() : Validation.Failure(["Too short"]));
    const emailValdator = x => (x.includes("@") ? Validation.Success() : Validation.Failure(["Invalid email"]));

    const model = {
      name: "t",
      email: "test@mail.com"
    };

    const validator = all(fields({ name: nameValidator }), fields({ email: emailValdator }));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(
      Validation.Failure([], {
        name: Validation.Failure(["Too short"])
      })
    );
  });

  it("disjunct filed validators failure - fail second: ", () => {
    // Arrange
    const nameValidator = x => (x.length > 3 ? Validation.Success() : Validation.Failure(["Too short"]));
    const emailValdator = x => (x.includes("@") ? Validation.Success() : Validation.Failure(["Invalid email"]));

    const model = {
      name: "test",
      email: "testmail.com"
    };

    const validator = all(fields({ name: nameValidator }), fields({ email: emailValdator }));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(
      Validation.Failure([], {
        email: Validation.Failure(["Invalid email"])
      })
    );
  });

  it("disjunct filed validators failure - fail both: ", () => {
    // Arrange
    const nameValidator = x => (x.length > 3 ? Validation.Success() : Validation.Failure(["Too short"]));
    const emailValdator = x => (x.includes("@") ? Validation.Success() : Validation.Failure(["Invalid email"]));

    const model = {
      name: "t",
      email: "testmail.com"
    };

    const validator = all(fields({ name: nameValidator }), fields({ email: emailValdator }));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(
      Validation.Failure([], {
        name: Validation.Failure(["Too short"]),
        email: Validation.Failure(["Invalid email"])
      })
    );
  });

  it("overlapping field validators success: ", () => {
    // Arrange
    const lengthValidator = x => (x.length > 3 ? Validation.Success() : Validation.Failure(["Too short"]));
    const emailValdator = x => (x.includes("@") ? Validation.Success() : Validation.Failure(["Invalid email"]));
    const model = { email: "test@mail.com" };

    const validator = all(fields({ email: lengthValidator }), fields({ email: emailValdator }));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toBe(Validation.Success())
  });

  it("overlapping filed validators - fail first: ", () => {
    // Arrange
    const lengthValidator = x => (x.length > 5 ? Validation.Success() : Validation.Failure(["Too short"]));
    const emailValdator = x => (x.includes("@") ? Validation.Success() : Validation.Failure(["Invalid email"]));
    const model = { email: "t@b.c" };

    const validator = all(fields({ email: lengthValidator }), fields({ email: emailValdator }));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { email: Validation.Failure(["Too short"]) }));
  });

  it("overlapping filed validators failure - fail second: ", () => {
    // Arrange
    const lengthValidator = x => (x.length > 3 ? Validation.Success() : Validation.Failure(["Too short"]));
    const emailValdator = x => (x.includes("@") ? Validation.Success() : Validation.Failure(["Invalid email"]));
    const model = { email: "testmail.com" };

    const validator = all(fields({ email: lengthValidator }), fields({ email: emailValdator }));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { email: Validation.Failure(["Invalid email"]) }));
  });

  it("overlapping filed validators failure - fail both: ", () => {
    // Arrange
    const lengthValidator = x => (x.length > 3 ? Validation.Success() : Validation.Failure(["Too short"]));
    const emailValdator = x => (x.includes("@") ? Validation.Success() : Validation.Failure(["Invalid email"]));
    const model = { email: "t" };

    const validator = all(fields({ email: lengthValidator }), fields({ email: emailValdator }));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { email: Validation.Failure(["Too short", "Invalid email"]) }));
  });

  it("field validator with path predicate - predicate false ", () => {
    // Arrange
    const nameValidator = jest.fn(x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"])));
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

    function getInnerProp(obj, searchKeyPath) {
      const [prop, ...rest] = searchKeyPath;
      return prop ? getInnerProp(obj[prop], rest) : obj;
    }

    const context = { fieldFilter: path => getInnerProp(dirtyInfo, path) };

    const validator = fields({
      child: fields({
        name: nameValidator
      })
    });

    // Act
    const validation = validator(model, context);

    // Assert
    expect(validation).toBe(Validation.Success());
    expect(nameValidator.mock.calls.length).toBe(0);
  });
});

describe("items validators:", () => {
  it("items validator success: ", () => {
    // Arrange
    const itemValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const model = ["test"];
    const validator = items(itemValidator);

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toBe(Validation.Success())
  });

  it("items validator error: ", () => {
    // Arrange
    const itemValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const model = ["testWrong"];
    const validator = items(itemValidator);

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { ["0"]: Validation.Failure(["Wrong"]) }));
  });

  it("both global and items validators success: ", () => {
    // Arrange
    const itemValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const globalValidator = x => (x.length > 0 ? Validation.Success() : Validation.Failure(["Empty"]));
    const model = ["test"];

    const validator = all(globalValidator, items(itemValidator));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toBe(Validation.Success());
  });

  it("both global and items validators - fail item: ", () => {
    // Arrange
    const itemValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const globalValidator = x => (x.length > 0 ? Validation.Success() : Validation.Failure(["Empty"]));
    const model = ["testWrong"];

    const validator = all(globalValidator, items(itemValidator));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { ["0"]: Validation.Failure(["Wrong"]) }));
  });

  it("both global and items validators - fail global: ", () => {
    // Arrange
    const itemValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const globalValidator = x => (x.length > 0 ? Validation.Success() : Validation.Failure(["Empty"]));
    const model = [];

    const validator = all(globalValidator, items(itemValidator));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure(["Empty"]));
  });

  it("overlapping items validators success: ", () => {
    // Arrange
    const nameValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const minLengthValidator = x => (x.length > 3 ? Validation.Success() : Validation.Failure(["Too short"]));
    const model = ["test"];

    const validator = all(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toBe(Validation.Success());
  });

  it("overlapping items validators - fail first: ", () => {
    // Arrange
    const nameValidator = x => (x === "testWrong" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const minLengthValidator = x => (x.length > 3 ? Validation.Success() : Validation.Failure(["Too short"]));
    const model = ["test"];

    const validator = all(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { ["0"]: Validation.Failure(["Wrong"]) }));
  });

  it("overlapping items validators failure - fail second: ", () => {
    // Arrange
    const nameValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const minLengthValidator = x => (x.length > 4 ? Validation.Success() : Validation.Failure(["Too short"]));
    const model = ["test"];

    const validator = all(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { ["0"]: Validation.Failure(["Too short"]) }));
  });

  it("overlapping items validators failure - fail both: ", () => {
    // Arrange
    const nameValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const minLengthValidator = x => (x.length > 4 ? Validation.Success() : Validation.Failure(["Too short"]));
    const model = ["t"];

    const validator = all(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { ["0"]: Validation.Failure(["Wrong", "Too short"]) }));
  });

  it("items validator - fail only one item", () => {
    // Arrange
    const nameValidator = x => (x === "test" ? Validation.Success() : Validation.Failure(["Wrong"]));
    const minLengthValidator = x => (x.length > 3 ? Validation.Success() : Validation.Failure(["Too short"]));
    const model = ["test", "testWrong"];

    const validator = all(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = validator(model);

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
    const maxLengthValidator = length => x => (x.length <= length ? Validation.Success() : Validation.Failure(["Too long"]));
    const model = {
      maxLength: 4,
      name: "test"
    };
    const validator = withModel(model => fields({ name: maxLengthValidator(model.maxLength) }));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toBe(Validation.Success());
  });

  it("model validator error: ", () => {
    // Arrange
    const maxLengthValidator = length => x => (x.length <= length ? Validation.Success() : Validation.Failure(["Too long"]));
    const model = {
      maxLength: 3,
      name: "test"
    };
    const validator = withModel(model => fields({ name: maxLengthValidator(model.maxLength) }));

    // Act
    const validation = validator(model);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { name: Validation.Failure(["Too long"]) }));
  });
});

describe("utility validators:", () => {
  it("dirtyFieldsOnly with debug validator", () => {
    // Arrange
    const nameValidator = jest.fn(_ => Validation.Failure(["Wrong"]));
    const surnameValidator = jest.fn(_ => Validation.Success());
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

    const validator = fields({
      child: fields({
        name: nameValidator,
        surname: surnameValidator
      })
    });

    // Act
    //const validation = model |> (validator |> dirtyFieldsOnly(dirtyInfo) |> debug);
    //haskell: validator |> dirtyFieldsOnly(dirtyInfo) $ model
    const validate = flow(
      dirtyFieldsOnly(dirtyInfo),
      debug
    )(validator);

    const validation = validate(model);

    // Assert
    expect(validation).toBe(Validation.Success());
    expect(nameValidator.mock.calls.length).toBe(0);
    expect(surnameValidator.mock.calls.length).toBe(1);
  });

  it("dirtyFieldsOnly on collection with debug validator", () => {
    // Arrange
    const nameValidator = jest.fn(_ => Validation.Failure(["Wrong"]));
    const surnameValidator = jest.fn(_ => Validation.Success());
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

    const validator = fields({
      children: items(
        fields({
          name: nameValidator,
          surname: surnameValidator
        })
      )
    });

    // Act
    const validate = flow(
      dirtyFieldsOnly(dirtyInfo),
      debug
    )(validator);

    const validation = validate(model);

    // Assert
    expect(validation).toBe(Validation.Success());

    expect(nameValidator.mock.calls.length).toBe(0);
    expect(surnameValidator.mock.calls.length).toBe(2);
  });
});
