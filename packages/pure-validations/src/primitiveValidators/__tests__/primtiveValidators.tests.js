// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Success, Failure } from "../../validation";
import ValidationError from "../../validationError";
import { validate } from "../../validator";
import { unique, required, email, between, greaterThan, lessThan, minLength, maxLength, matches, atLeastOne, valid, isInteger, isNumber } from "../index";
import i18next from "i18next";

describe("required validator:", () => {
  it("required validator success", () => {
    // Arrange
    const model = "value";
    const validator = required;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("required validator error - empty string", () => {
    // Arrange
    const model = "";
    const validator = required;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Mandatory"))));
  });

  it("required validator error - null", () => {
    // Arrange
    const model = null;
    const validator = required;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Mandatory"))));
  });

  it("required validator error - undefined", () => {
    // Arrange
    const model = null;
    const validator = required;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Mandatory"))));
  });
});

describe("atLeastOne validator:", () => {
  it("atLeastOne validator error - empty array", () => {
    // Arrange
    const model = [];
    const validator = atLeastOne;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.AtLeastOne"))));
  });
});

describe("format validators:", () => {
  it("email validator success standard", () => {
    // Arrange
    const model = "aa@bb.cc";
    const validator = email;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("email validator success dot username", () => {
    // Arrange
    const model = "a.a@bb.cc";
    const validator = email;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("email validator success ip address domain", () => {
    // Arrange
    const model = "aa@[1.1.1.1]";
    const validator = email;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("email validator error - null", () => {
    // Arrange
    const model = null;
    const validator = email;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Email"))));
  });

  it("email validator error - wrong format (missing domain)", () => {
    // Arrange
    const model = "aa@bb";
    const validator = email;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Email"))));
  });

  it("email validator error - wrong format (incomplete domain name - RULE: at least 2 characters per component)", () => {
    // Arrange
    const model = "aa@b.cc";
    const validator = email;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Email"))));
  });

  it("email validator error - wrong format (RULE: dot before @ not allowed)", () => {
    // Arrange
    const model = "a.@bb.cc";
    const validator = email;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Email"))));
  });

  it("matches validator success", () => {
    // Arrange
    const model = "ababb";
    const validator = matches(/^[a-b]*$/);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("another matches validator success", () => {
    // Arrange
    const model = "ababbc";
    const validator = matches(/^[a-b]*$/);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Regex"))));
  });
});

describe("comparison validators:", () => {
  it("between validator success", () => {
    // Arrange
    const model = 4;
    const validator = between(3, 4);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("between validator error - greater", () => {
    // Arrange
    const model = 5;
    const validator = between(3, 4);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.OutOfRange", { min: 3, max: 4 }))));
  });

  it("between validator error - smaller", () => {
    // Arrange
    const model = 2;
    const validator = between(3, 4);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.OutOfRange", { min: 3, max: 4 }))));
  });

  it("greaterThan validator success", () => {
    // Arrange
    const model = 5;
    const validator = greaterThan(4);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("greaterThan validator error", () => {
    // Arrange
    const model = 4;
    const validator = greaterThan(4);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Greater", { min: 4 }))));
  });

  it("lessThan validator success", () => {
    // Arrange
    const model = 4;
    const validator = lessThan(5);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("lessThan validator error", () => {
    // Arrange
    const model = 4;
    const validator = lessThan(4);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Less", { max: 4 }))));
  });
});

describe("length validators:", () => {
  it("minLength validator success", () => {
    // Arrange
    const model = "12345";
    const validator = minLength(4);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("minLength validator error", () => {
    // Arrange
    const model = "1234";
    const validator = minLength(4);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.MinCharacters", { min: 4 }))));
  });

  it("maxLength validator success", () => {
    // Arrange
    const model = "1234";
    const validator = maxLength(5);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("maxLength validator error", () => {
    // Arrange
    const model = "1234";
    const validator = maxLength(4);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.MaxCharacters", { max: 4 }))));
  });
});

describe("valid validator:", () => {
  it("valid validator success", () => {
    // Arrange
    const model = "value";
    const validator = valid;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

});

describe("number validators:", () => {
  it("isInteger validator success", () => {
    // Arrange
    const model = -1;
    const validator = isInteger;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("isInteger validator - null failure", () => {
    // Arrange
    const model = null;
    const validator = isInteger;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Integer"))));
  });

  it("isInteger validator failure", () => {
    // Arrange
    const model = NaN;
    const validator = isInteger;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Integer"))));
  });

  it("isNumber validator success", () => {
    // Arrange
    const model = -1;
    const validator = isNumber;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("isNumber validator - null failure", () => {
    // Arrange
    const model = null;
    const validator = isNumber;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Number"))));
  });

  it("isNumber validator failure", () => {
    // Arrange
    const model = NaN;
    const validator = isNumber;

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Number"))));
  });  
});

describe("unique validator:", () => {
  it("unique validator success - no selector", () => {
    // Arrange
    const model = [1, 2, 3];
    const validator = unique();

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("unique validator error - no selector", () => {
    // Arrange
    const model = [1, 2, 1];
    const validator = unique();

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Unique", { selector: "" }))));
  });

  it("unique validator success - nested item string selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 3 } }];
    const validator = unique("item.id");

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("unique validator error - nested item string selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 1 } }];
    const validator = unique("item.id");

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Unique", { selector: "item.id" }))));
  });

  it("unique validator success - nested item array selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 3 } }];
    const validator = unique(["item", "id"]);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("unique validator error - nested item array selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 1 } }];
    const validator = unique(["item", "id"]);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Unique", { selector: "item,id" }))));
  });

  it("unique validator success - nested item function selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 3 } }];
    const validator = unique(x => x.item.id);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Success);
  });

  it("unique validator error - nested item function selector", () => {
    // Arrange
    const model = [{ item: { id: 1 } }, { item: { id: 2 } }, { item: { id: 1 } }];
    const validator = unique(x => x.item.id);

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toStrictEqual(Failure(ValidationError(i18next.t("Validations.Generic.Unique", { selector: "x => x.item.id" }))));
  });
});


