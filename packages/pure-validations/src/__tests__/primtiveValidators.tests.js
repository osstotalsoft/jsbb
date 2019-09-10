import { Validation } from "../validation";
import { validate } from "../validator"
import { isUnique, isMandatory, isEmail, isInRange, isGreaterThan, isLessThan, hasLengthGreaterThan, hasLengthLessThan, matches } from "../primitiveValidators";
import i18next from "i18next";

describe("mandatory primitive validator:", () => {
  it("mandatory validator success", () => {
    // Arrange
    const model = "value";
    const validator = isMandatory;

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("mandatory validator error - empty string", () => {
    // Arrange
    const model = "";
    const validator = isMandatory;

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Mandatory")]));
  });

  it("mandatory validator error - null", () => {
    // Arrange
    const model = null;
    const validator = isMandatory;

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Mandatory")]));
  });

  it("mandatory validator error - undefined", () => {
    // Arrange
    const model = null;
    const validator = isMandatory;

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Mandatory")]));
  });

  it("mandatory validator error - empty array", () => {
    // Arrange
    const model = [];
    const validator = isMandatory;

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Mandatory")]));
  });
});

describe("format primitive validators:", () => {
  it("email validator success", () => {
    // Arrange
    const model = "aa@bb.cc";
    const validator = isEmail;

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("email validator error - null", () => {
    // Arrange
    const model = null;
    const validator = isEmail;

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Email")]));
  });

  it("email validator error - wrong format", () => {
    // Arrange
    const model = "a@b";
    const validator = isEmail;

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Email")]));
  });

  it("matches validator success", () => {
    // Arrange
    const model = "ababb";
    const validator = matches(/^[a-b]*$/);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("another matches validator success", () => {
    // Arrange
    const model = "ababbc";
    const validator = matches(/^[a-b]*$/);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Regex")]));
  });
});

describe("comparison primitive validators:", () => {
  it("isInRange validator success", () => {
    // Arrange
    const model = 4;
    const validator = isInRange(3, 4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("isInRange validator error - greater", () => {
    // Arrange
    const model = 5;
    const validator = isInRange(3, 4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.OutOfRange", { min: 3, max: 4 })]));
  });

  it("isInRange validator error - smaller", () => {
    // Arrange
    const model = 2;
    const validator = isInRange(3, 4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.OutOfRange", { min: 3, max: 4 })]));
  });

  it("isGreaterThan validator success", () => {
    // Arrange
    const model = 5;
    const validator = isGreaterThan(4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("isGreaterThan validator error", () => {
    // Arrange
    const model = 4;
    const validator = isGreaterThan(4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Greater", { min: 4 })]));
  });

  it("isLessThan validator success", () => {
    // Arrange
    const model = 4;
    const validator = isLessThan(5);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("isLessThan validator error", () => {
    // Arrange
    const model = 4;
    const validator = isLessThan(4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Less", { max: 4 })]));
  });
});

describe("length primitive validators:", () => {
  it("hasLengthGreaterThan validator success", () => {
    // Arrange
    const model = "12345";
    const validator = hasLengthGreaterThan(4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("hasLengthGreaterThan validator error", () => {
    // Arrange
    const model = "1234";
    const validator = hasLengthGreaterThan(4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.MinCharacters", { min: 4 })]));
  });

  it("hasLengthLessThan validator success", () => {
    // Arrange
    const model = "1234";
    const validator = hasLengthLessThan(5);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("hasLengthLessThan validator error", () => {
    // Arrange
    const model = "1234";
    const validator = hasLengthLessThan(4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.MaxCharacters", { max: 4 })]));
  });
});

describe("unique primitive validator:", () => {
  it("unique validator success - no selector", () => {
    // Arrange
    const model = [1, 2, 3];
    const validator = isUnique();

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("unique validator error - no selector", () => {
    // Arrange
    const model = [1, 2, 1];
    const validator = isUnique();

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Unique", { selector: "" })]));
  });

  it("unique validator success - nested item string selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 3 } }];
    const validator = isUnique("item.id");

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("unique validator error - nested item string selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 1 } }];
    const validator = isUnique("item.id");

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Unique", { selector: "item.id" })]));
  });

  it("unique validator success - nested item array selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 3 } }];
    const validator = isUnique(["item", "id"]);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("unique validator error - nested item array selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 1 } }];
    const validator = isUnique(["item", "id"]);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Unique", { selector: "item,id" })]));
  });

  it("unique validator success - nested item function selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 3 } }];
    const validator = isUnique(x => x.item.id);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("unique validator error - nested item function selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 1 } }];
    const validator = isUnique(x => x.item.id);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Unique", { selector: "x => x.item.id" })]));
  });
});
