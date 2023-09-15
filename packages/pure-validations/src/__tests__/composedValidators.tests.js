// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Success, Failure } from "../validation";
import { validate, Validator } from "../validator";
import { required, maxLength, greaterThan, unique, atLeastOne, email } from "../primitiveValidators";
import { shape, items, stopOnFirstFailure, when, fromModel, logTo, concatFailure, field, fromRoot } from "../higherOrderValidators";
import ValidationError from "../validationError";
import { parse } from "../parser";
describe("composed validators:", () => {
  it("readme validator: ", () => {
    // Arrange
    const console = { log: () => {} };
    const english = field("english");

    const validator =
      shape({
        firstName: required,
        lastName: [required, maxLength(50)] |> stopOnFirstFailure,
        userAgreement: fromRoot(root => required |> when(root.gdprRequired)),
        contactInfo: shape({
          email: email,
          address: required
        }),
        languages: required |> english,
        education: [atLeastOne, unique(x => x.id), required |> items] |> concatFailure,
        experience: fromModel(experience => shape({ javaScript: greaterThan(experience.minimumExperience) }))
      }) |> logTo(console);

    const model = {
      firstName: "firstName",
      lastName: "lastName",
      userAgreement: true,
      contactInfo: {
        email: "rpopovici@gmai.com",
        address: "some str"
      },
      languages: {
        english: "A1"
      },
      education: [{ id: 1 }],
      experience: {
        javaScript: 7,
        minimumExperience: 3
      },
      gdprRequired: true
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

  it("required on missing field: ", () => {
    // Arrange
    const model = {
    };

    const validator = shape({ name: required });

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(
      Failure(
        ValidationError([], {
          name: ValidationError("Validations.Generic.Mandatory{}")
        })
      )
    );
  });

  it("required on a field in a missing object: ", () => {
    // Arrange
    const model = undefined;

    const validator = shape({ name: required });

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(
      Failure(
        ValidationError([], {
          name: ValidationError("Validations.Generic.Mandatory{}")
        })
      )
    );
  });

  it("required on a field in a missing nested object: ", () => {
    // Arrange
    const model = undefined;

    const validator = shape({parent: shape({ name: required })});

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(
      Failure(
        ValidationError([], {
          parent: 
            ValidationError([], {
              name: ValidationError("Validations.Generic.Mandatory{}")
            })
        })
      )
    );
  });

  it("required on a field in a missing nested object with fromModel: ", () => {
    // Arrange
    const model = undefined;

    const validator = fromModel(_ => shape({parent: shape({ name: required })}));

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(
      Failure(
        ValidationError([], {
          parent: 
            ValidationError([], {
              name: ValidationError("Validations.Generic.Mandatory{}")
            })
        })
      )
    );
  });

  it("validation using undefined validator throws exception:", () => {
    // Arrange
    const model = {};
    const validator = undefined;

    // Act
    const action = () => model |> validate(validator);

    // Assert
    expect(action).toThrow(new Error("Value 'undefined' is not a validator!"));
  });

  it("validation using null validator throws exception:", () => {
    // Arrange
    const model = {};
    const validator = null;

    // Act
    const action = () => model |> validate(validator);

    // Assert
    expect(action).toThrow(new Error("Value 'null' is not a validator!"));
  });

  it("validation using invalid validator throws exception:", () => {
    // Arrange
    const model = {};
    const validator = "wrong";

    // Act
    const action = () => model |> validate(validator);

    // Assert
    expect(action).toThrow(new Error("Value 'wrong' is not a validator!"));
  });

  it("validation using nested undefined validator throws exception:", () => {
    // Arrange

    // Act
    const action = () => stopOnFirstFailure(shape({ email: undefined }));

    // Assert
    expect(action).toThrow(new Error("Value 'undefined' is not a validator!"));
  });

  it("validation using invalid nested validator throws exception:", () => {
    // Arrange

    // Act
    const action = () => stopOnFirstFailure(shape({ email: model => !!model }));

    // Assert
    expect(action).toThrow(new Error("Value 'model => !!model' is not a validator!"));
  });

  it("parses validator ", () => {
    // Arrange
    const lengthValidator = Validator.of(Success);
    const emailValdator = Validator.of(Success);
    const model = { email: "test@mail.com" };

    const validatorText = `stopOnFirstFailure(shape({ email: lengthValidator }), shape({ email: emailValdator }))`;
    const validator = parse(validatorText, { scope : {lengthValidator, emailValdator }});

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toBe(Success);
  });

});
