import { Success, Failure, getErrors, getInner } from "../validation";
import { concat, empty } from "ramda";
import ValidationError from "../validationError";

function applyLaw(law) {
  return (...args) => isEquivalent => law(isEquivalent)(...args);
}
function expectLawValid(lawEvaluator) {
  return lawEvaluator((a, b) => expect(a).toStrictEqual(b));
}

describe("validation tests suite:", () => {
  it("monoid left identity law: ", () => {
    // Arrange
    var failure = Failure(
      ValidationError(["err1", "err2"], {
        a: ValidationError("errA")
      })
    );

    // Act
    const leftIdentityLaw = isEquivalent =>
      function(m) {
        return isEquivalent(concat(empty(m), m), m);
      };
    var lawEvaluator = applyLaw(leftIdentityLaw)(failure);

    // Assert
    expectLawValid(lawEvaluator);
  });

  it("monoid right identity law: ", () => {
    // Arrange
    var identity = Success;
    var failure = Failure(
      ValidationError(["err1", "err2"], {
        a: ValidationError("errA")
      })
    );

    // Act
    var result = concat(failure, identity);

    // Assert
    expect(result).toStrictEqual(failure);
  });

  it("monoid associativity law: ", () => {
    // Arrange
    var failure1 = Failure(
      ValidationError(["err1"], {
        a: ValidationError(["errA1"])
      })
    );
    var failure2 = Failure(
      ValidationError(["err2"], {
        a: ValidationError("errA2")
      })
    );
    var failure3 = Failure(
      ValidationError(["err3"], {
        a: ValidationError("errA3")
      })
    );

    // Act
    var result1 = concat(concat(failure1, failure2), failure3);
    var result2 = concat(failure1, concat(failure2, failure3));

    // Assert
    expect(result1).toStrictEqual(result2);
  });

  it("get inner validation:", () => {
    // Arrange
    const innerValidationError = ValidationError(["Err2", "Err1"]);
    const validation = Failure(
      ValidationError([], {
        field1: ValidationError([], {
          field11: innerValidationError
        })
      })
    );

    const resultValidation = validation |> getInner(["field1", "field11"]);
    const resultValidationError = resultValidation.cata({
      Just: x => x,
      Nothing: _ => null
    });

    // Assert
    expect(resultValidationError).toBe(innerValidationError);
  });

  // it("get inner validation called twice returns same refernce :", () => {
  //   // Arrange
  //   const errors = ["Err2", "Err1"];
  //   const innerValidationError = ValidationError(errors);
  //   const validation = Validation.Failure([], {
  //     field1: ValidationError([], {
  //       field11: innerValidationError
  //     })
  //   });

  //   const v1 = validation |> getInner(["field1", "field11"]);
  //   const v2 = validation |> getInner(["field1", "field11"]);

  //   // Assert
  //   expect(v1).toBe(v2);
  // });

  it("get inner validation should return success if path not found:", () => {
    // Arrange
    const innerValidation = ValidationError(["Err2", "Err1"]);
    const validation = Failure(
      ValidationError([], {
        field1: ValidationError([], {
          field11: innerValidation
        })
      })
    );

    var result = validation |> getInner(["notFoundField", "field11"]);

    // Assert
    expect(result).toBe(Success);
  });

  it("get errors on success should return empty array:", () => {
    // Arrange
    const validation = Success;

    var result = getErrors(validation);

    // Assert
    expect(result).toStrictEqual([]);
  });

  it("get errors:", () => {
    // Arrange
    const errors = ["Err2", "Err1"];
    const validation = Failure(ValidationError(errors));

    var result = getErrors(validation);

    // Assert
    expect(result).toStrictEqual(errors);
  });

  it("reference economy empty success: ", () => {
    // Arrange
    var success1 = Success;
    var success2 = Success;

    // Act
    var result = concat(success1, success2);

    // Assert
    expect(result).toBe(success1);
    expect(result).toBe(success2);
  });

  // it("reference economy full: ", () => {
  //   // Arrange
  //   var failure1 = Validation.Failure(["err1"], {
  //     a: Validation.Failure(["errA1"], {
  //       aa: Validation.Failure(["errAA1", "errAA2"]),
  //       ab: Validation.Success()
  //     }),
  //     b: Validation.Success()
  //   });
  //   var failure2 = Validation.Failure(["err1"], {
  //     a: Validation.Failure(["errA1"], {
  //       aa: Validation.Failure(["errAA1", "errAA2"]),
  //       ab: Validation.Success()
  //     }),
  //     b: Validation.Success()
  //   });

  //   // Act
  //   var result = concat(AllValidation(failure1), AllValidation(failure2)).value;

  //   // Assert
  //   expect(result).toBe(failure1);
  // });
});
