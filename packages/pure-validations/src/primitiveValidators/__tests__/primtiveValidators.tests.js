import { Validation } from "../../validation";
import { validate } from "../../validator"
import { unique, required, email, between, greaterThan, lessThan, minLength, maxLength, matches, atLeastOne } from "../index";
import i18next from "i18next";

describe("required validator:", () => {
  it("required validator success", () => {
    // Arrange
    const model = "value";
    const validator = required;

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("required validator error - empty string", () => {
    // Arrange
    const model = "";
    const validator = required;

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Mandatory")]));
  });

  it("required validator error - null", () => {
    // Arrange
    const model = null;
    const validator = required;

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Mandatory")]));
  });

  it("required validator error - undefined", () => {
    // Arrange
    const model = null;
    const validator = required;

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Mandatory")]));
  });
});

describe("atLeastOne validator:", () => {
  it("atLeastOne validator error - empty array", () => {
    // Arrange
    const model = [];
    const validator = atLeastOne;

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.AtLeastOne")]));
  });
});

describe("format validators:", () => {
  it("email validator success", () => {
    // Arrange
    const model = "aa@bb.cc";
    const validator = email;

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("email validator error - null", () => {
    // Arrange
    const model = null;
    const validator = email;

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Email")]));
  });

  it("email validator error - wrong format", () => {
    // Arrange
    const model = "a@b";
    const validator = email;

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

describe("comparison validators:", () => {
  it("between validator success", () => {
    // Arrange
    const model = 4;
    const validator = between(3, 4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("between validator error - greater", () => {
    // Arrange
    const model = 5;
    const validator = between(3, 4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.OutOfRange", { min: 3, max: 4 })]));
  });

  it("between validator error - smaller", () => {
    // Arrange
    const model = 2;
    const validator = between(3, 4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.OutOfRange", { min: 3, max: 4 })]));
  });

  it("greaterThan validator success", () => {
    // Arrange
    const model = 5;
    const validator = greaterThan(4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("greaterThan validator error", () => {
    // Arrange
    const model = 4;
    const validator = greaterThan(4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Greater", { min: 4 })]));
  });

  it("lessThan validator success", () => {
    // Arrange
    const model = 4;
    const validator = lessThan(5);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("lessThan validator error", () => {
    // Arrange
    const model = 4;
    const validator = lessThan(4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Less", { max: 4 })]));
  });
});

describe("length validators:", () => {
  it("minLength validator success", () => {
    // Arrange
    const model = "12345";
    const validator = minLength(4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("minLength validator error", () => {
    // Arrange
    const model = "1234";
    const validator = minLength(4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.MinCharacters", { min: 4 })]));
  });

  it("maxLength validator success", () => {
    // Arrange
    const model = "1234";
    const validator = maxLength(5);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("maxLength validator error", () => {
    // Arrange
    const model = "1234";
    const validator = maxLength(4);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.MaxCharacters", { max: 4 })]));
  });
});

describe("unique validator:", () => {
  it("unique validator success - no selector", () => {
    // Arrange
    const model = [1, 2, 3];
    const validator = unique();

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("unique validator error - no selector", () => {
    // Arrange
    const model = [1, 2, 1];
    const validator = unique();

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Unique", { selector: "" })]));
  });

  it("unique validator success - nested item string selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 3 } }];
    const validator = unique("item.id");

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("unique validator error - nested item string selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 1 } }];
    const validator = unique("item.id");

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Unique", { selector: "item.id" })]));
  });

  it("unique validator success - nested item array selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 3 } }];
    const validator = unique(["item", "id"]);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("unique validator error - nested item array selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 1 } }];
    const validator = unique(["item", "id"]);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Unique", { selector: "item,id" })]));
  });

  it("unique validator success - nested item function selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 3 } }];
    const validator = unique(x => x.item.id);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Success());
  });

  it("unique validator error - nested item function selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 1 } }];
    const validator = unique(x => x.item.id);

    // Act
    const validation = model |> validate(validator)

    // Assert
    expect(validation).toStrictEqual(Validation.Failure([i18next.t("Validations.Generic.Unique", { selector: "x => x.item.id" })]));
  });
});
