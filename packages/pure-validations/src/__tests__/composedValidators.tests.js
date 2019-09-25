import { Validation } from "../validation";
import { validate, Validator } from "../validator";
import { required, maxLength, greaterThan, unique } from "../primitiveValidators";
import { shape, items, all, when, fromModel, logTo, concat } from "../higherOrderValidators";

describe("composed validators:", () => {
  it("readme validator: ", () => {
    const gdprAgreement = () => true;
    // Arrange
    const validator =
      shape({
        contactInfo: shape({
          name: [required, maxLength(50)] |> all,
          email: required |> when(gdprAgreement)
        }),
        personalInfo: fromModel(x =>
          shape({
            age: greaterThan(x.minimumAllowedAge)
          })
        ),
        assets: [unique("id"), required |> items] |> concat
      }) |> logTo({ log: () => {} });

    const model = {
      contactInfo: {
        name: "name",
        email:"rpopovici@gmai.com"
      },
      personalInfo: {
        age: 19,
        minimumAllowedAge: 18
      }
    };

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toBe(Validation.Success());
  });

  it("all and shape validator failure : ", () => {
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

  it("all and shape validator success: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Validation.Success());
    const globalValidator = Validator.of(Validation.Success());
    const model = { email: "test" };

    const validator = all(globalValidator, shape({ email: fieldValidator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("all and shape validator both global and fields validators - fail global: ", () => {
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

  it("all and shape validators disjunct fields validators success: ", () => {
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
      Validation.Success()
    );
  });

  it("all and shape validators disjunct fields validators failure - fail first: ", () => {
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

  it("all and shape validators disjunct fields validators failure - fail second: ", () => {
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

  it("all and shape validators disjunct fields validators failure - fail both: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Failure(["Too short"]));
    const emailValdator = Validator.of(Validation.Failure(["Invalid email"]));

    const model = {
      name: "t",
      email: "testmail.com"
    };

    const validator = concat(shape({ name: nameValidator }), shape({ email: emailValdator }));

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

  it("all and shape validators overlapping fields validators success: ", () => {
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

  it("all and shape validators overlapping fields validators - fail first: ", () => {
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

  it("all and shape validators overlapping fields validators failure - fail second: ", () => {
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

  it("concat and shape validators overlapping fields validators failure - fail both: ", () => {
    // Arrange
    const lengthValidator = Validator.of(Validation.Failure(["Too short"]));
    const emailValdator = Validator.of(Validation.Failure(["Invalid email"]));
    const model = { email: "t" };

    const validator = concat(shape({ email: lengthValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { email: Validation.Failure(["Too short", "Invalid email"]) }));
  });

  it("all and items validators success: ", () => {
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

  it("all and items validators - fail item: ", () => {
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

  it("all and items validators - fail only one item", () => {
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

  it("all and items validators - fail global: ", () => {
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

  it("all and items validators overlapping items validators success: ", () => {
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

  it("all and items validators overlapping items validators - fail first: ", () => {
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

  it("all and items validators overlapping items validators failure - fail second: ", () => {
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

  it("concat and items validators overlapping items validators failure - fail both: ", () => {
    // Arrange
    const nameValidator = Validator.of(Validation.Failure(["Wrong"]));
    const minLengthValidator = Validator.of(Validation.Failure(["Too short"]));
    const model = ["t"];

    const validator = concat(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([], { ["0"]: Validation.Failure(["Wrong", "Too short"]) }));
  });

  


});
