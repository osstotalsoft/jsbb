import { Success, Failure } from "../validation";
import { validate, Validator } from "../validator";
import { required, maxLength, greaterThan, unique } from "../primitiveValidators";
import { shape, items, stopOnFirstFailure, when, fromModel, logTo, concatFailure } from "../higherOrderValidators";
import ValidationError from "../validationError";
describe("composed validators:", () => {
  it("readme validator: ", () => {
    const gdprAgreement = () => true;
    // Arrange
    const validator =
      shape({
        contactInfo: shape({
          name: [required, maxLength(50)] |> stopOnFirstFailure,
          email: required |> when(gdprAgreement)
        }),
        personalInfo: fromModel(x =>
          shape({
            age: greaterThan(x.minimumAllowedAge)
          })
        ),
        assets: [unique("id"), required |> items] |> concatFailure
      }) |> logTo({ log: () => {} });

    const model = {
      contactInfo: {
        name: "name",
        email: "rpopovici@gmai.com"
      },
      personalInfo: {
        age: 19,
        minimumAllowedAge: 18
      }
    };

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toBe(Success);
  });

  it("stopOnFirstFailure and shape validator failure : ", () => {
    // Arrange
    const fieldValidator = Validator.of(Failure(ValidationError("Wrong")));
    const globalValidator = Validator.of(Success);

    const model = { email: "testWrong" };

    const validator = stopOnFirstFailure(globalValidator, shape({ email: fieldValidator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError([], { email: ValidationError("Wrong") })));
  });

  it("stopOnFirstFailure and shape validator success: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Success);
    const globalValidator = Validator.of(Success);
    const model = { email: "test" };

    const validator = stopOnFirstFailure(globalValidator, shape({ email: fieldValidator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("alstopOnFirstFailurel and shape validator both global and fields validators - fail global: ", () => {
    // Arrange
    const fieldValidator = Validator.of(Success);
    const globalValidator = Validator.of(Failure(ValidationError("Mandatory")));
    const model = {};

    const validator = stopOnFirstFailure(globalValidator, shape({ email: fieldValidator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError("Mandatory")));
  });

  it("stopOnFirstFailure and shape validators disjunct fields validators success: ", () => {
    // Arrange
    const nameValidator = Validator.of(Success);
    const emailValdator = Validator.of(Success);

    const model = {
      name: "test",
      email: "test@mail.com"
    };

    const validator = stopOnFirstFailure(shape({ name: nameValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("stopOnFirstFailure and shape validators disjunct fields validators failure - fail first: ", () => {
    // Arrange
    const nameValidator = Validator.of(Failure(ValidationError("Too short")));
    const emailValdator = Validator.of(Success);

    const model = {
      name: "t",
      email: "test@mail.com"
    };

    const validator = stopOnFirstFailure(shape({ name: nameValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(
      Failure(
        ValidationError([], {
          name: ValidationError("Too short")
        })
      )
    );
  });

  it("stopOnFirstFailure and shape validators disjunct fields validators failure - fail second: ", () => {
    // Arrange
    const nameValidator = Validator.of(Success);
    const emailValdator = Validator.of(Failure(ValidationError("Invalid email")));

    const model = {
      name: "test",
      email: "testmail.com"
    };

    const validator = stopOnFirstFailure(shape({ name: nameValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(
      Failure(
        ValidationError([], {
          email: ValidationError("Invalid email")
        })
      )
    );
  });

  it("concatFailure and shape validators disjunct fields validators failure - fail both: ", () => {
    // Arrange
    const nameValidator = Validator.of(Failure(ValidationError("Too short")));
    const emailValdator = Validator.of(Failure(ValidationError("Invalid email")));

    const model = {
      name: "t",
      email: "testmail.com"
    };

    const validator = concatFailure(shape({ name: nameValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(
      Failure(
        ValidationError([], {
          name: ValidationError("Too short"),
          email: ValidationError("Invalid email")
        })
      )
    );
  });

  it("stopOnFirstFailure and shape validators overlapping fields validators success: ", () => {
    // Arrange
    const lengthValidator = Validator.of(Success);
    const emailValdator = Validator.of(Success);
    const model = { email: "test@mail.com" };

    const validator = stopOnFirstFailure(shape({ email: lengthValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toBe(Success);
  });

  it("stopOnFirstFailure and shape validators overlapping fields validators - fail first: ", () => {
    // Arrange
    const lengthValidator = Validator.of(Failure(ValidationError("Too short")));
    const emailValdator = Validator.of(Success);
    const model = { email: "t@b.c" };

    const validator = stopOnFirstFailure(shape({ email: lengthValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError([], { email: ValidationError("Too short") })));
  });

  it("stopOnFirstFailure and shape validators overlapping fields validators failure - fail second: ", () => {
    // Arrange
    const lengthValidator = Validator.of(Success);
    const emailValdator = Validator.of(Failure(ValidationError("Invalid email")));
    const model = { email: "testmail.com" };

    const validator = stopOnFirstFailure(shape({ email: lengthValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError([], { email: ValidationError("Invalid email") })));
  });

  it("concatFailure and shape validators overlapping fields validators failure - fail both: ", () => {
    // Arrange
    const lengthValidator = Validator.of(Failure(ValidationError("Too short")));
    const emailValdator = Validator.of(Failure(ValidationError("Invalid email")));
    const model = { email: "t" };

    const validator = concatFailure(shape({ email: lengthValidator }), shape({ email: emailValdator }));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError([], { email: ValidationError(["Too short", "Invalid email"]) })));
  });

  it("stopOnFirstFailure and items validators success: ", () => {
    // Arrange
    const itemValidator = Validator.of(Success);
    const globalValidator = Validator.of(Success);
    const model = ["test"];

    const validator = stopOnFirstFailure(globalValidator, items(itemValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toBe(Success);
  });

  it("stopOnFirstFailure and items validators - fail item: ", () => {
    // Arrange
    const itemValidator = Validator.of(Failure(ValidationError("Wrong")));
    const globalValidator = Validator.of(Success);
    const model = ["testWrong"];

    const validator = stopOnFirstFailure(globalValidator, items(itemValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError([], { 0: ValidationError("Wrong") })));
  });

  it("stopOnFirstFailure and items validators - fail only one item", () => {
    // Arrange
    const nameValidator = Validator(m => (m == "test" ? Success : Failure(ValidationError("Wrong"))));
    const minLengthValidator = Validator.of(Success);
    const model = ["test", "testWrong"];

    const validator = stopOnFirstFailure(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(
      Failure(
        ValidationError([], {
          1: ValidationError("Wrong")
        })
      )
    );
  });

  it("stopOnFirstFailure and items validators - fail global: ", () => {
    // Arrange
    const itemValidator = Validator.of(Success);
    const globalValidator = Validator.of(Failure(ValidationError("Empty")));
    const model = [];

    const validator = stopOnFirstFailure(globalValidator, items(itemValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError("Empty")));
  });

  it("stopOnFirstFailure and items validators overlapping items validators success: ", () => {
    // Arrange
    const nameValidator = Validator.of(Success);
    const minLengthValidator = Validator.of(Success);
    const model = ["test"];

    const validator = stopOnFirstFailure(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("stopOnFirstFailure and items validators overlapping items validators - fail first: ", () => {
    // Arrange
    const nameValidator = Validator.of(Failure(ValidationError("Wrong")));
    const minLengthValidator = Validator.of(Success);
    const model = ["test"];

    const validator = stopOnFirstFailure(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError([], { 0: ValidationError("Wrong") })));
  });

  it("stopOnFirstFailure and items validators overlapping items validators failure - fail second: ", () => {
    // Arrange
    const nameValidator = Validator.of(Success);
    const minLengthValidator = Validator.of(Failure(ValidationError("Too short")));
    const model = ["test"];

    const validator = stopOnFirstFailure(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError([], { 0: ValidationError("Too short") })));
  });

  it("concatFailure and items validators overlapping items validators failure - fail both: ", () => {
    // Arrange
    const nameValidator = Validator.of(Failure(ValidationError("Wrong")));
    const minLengthValidator = Validator.of(Failure(ValidationError("Too short")));
    const model = ["t"];

    const validator = concatFailure(items(nameValidator), items(minLengthValidator));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError([], { 0: ValidationError(["Wrong", "Too short"]) })));
  });
});
