// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { ValidationProxy, eject } from "../";
import { Success, Failure, ValidationError } from "@totalsoft/pure-validations";


jest.unmock("@totalsoft/pure-validations");

describe("validation proxy", () => {
    it("returns inner validation", () => {
        // Arrange
        const validation = Failure(ValidationError("", { value: ValidationError("Error") }))
        const proxy = ValidationProxy(validation)

        // Act
        const innerValidation = eject(proxy.value);

        // Assert
        expect(innerValidation).toStrictEqual(Failure(ValidationError("Error")))
    });
    it("returns success if inner validation not found", () => {
        // Arrange
        const validation = Success
        const proxy = ValidationProxy(validation)

        // Act
        const innerValidation = eject(proxy.value);

        // Assert
        expect(innerValidation).toBe(Success)
    });
})