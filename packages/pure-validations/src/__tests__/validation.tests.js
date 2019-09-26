import { Validation, getErrors, getInner } from "../validation";
import { concat } from "../fantasy/prelude";
import fl from "fantasy-land";

function applyLaw(law) {
  return (...args) => isEquivalent => law(isEquivalent)(...args);
}
function expectLawValid(lawEvaluator) {
  return lawEvaluator((a, b) => expect(a).toStrictEqual(b));
}

describe("validation tests suite:", () => {
  it("monoid left identity law: ", () => {
    // Arrange
    var failure = Validation.Failure(["err1", "err2"], {
      a: Validation.Failure(["errA"])
    });

    // Act
    const leftIdentityLaw = isEquivalent =>
      function(m) {
        return isEquivalent(m.constructor[fl.empty]()[fl.concat](m), m);
      };
    var lawEvaluator = applyLaw(leftIdentityLaw)(failure);

    // Assert
    expectLawValid(lawEvaluator);
  });

  it("monoid right identity law: ", () => {
    // Arrange
    var identity = Validation.Success();
    var failure = Validation.Failure(["err1", "err2"], {
      a: Validation.Failure(["errA"])
    });

    // Act
    var result = concat(failure, identity);

    // Assert
    expect(result).toStrictEqual(failure);
  });

  it("monoid associativity law: ", () => {
    // Arrange
    var failure1 = Validation.Failure(["err1"], {
      a: Validation.Failure(["errA1"])
    });
    var failure2 = Validation.Failure(["err2"], {
      a: Validation.Failure(["errA2"])
    });
    var failure3 = Validation.Failure(["err3"], {
      a: Validation.Failure(["errA3"])
    });

    // Act
    var result1 = concat(concat(failure1, failure2), failure3);
    var result2 = concat(failure1, concat(failure2, failure3));

    // Assert
    expect(result1).toStrictEqual(result2);
  });

  it("get inner validation:", () => {
    // Arrange
    const errors = ["Err2", "Err1"];
    const innerValidation = Validation.Failure(errors);
    const validation = Validation.Failure([], {
      field1: Validation.Failure([], {
        field11: innerValidation
      })
    });

    var result = validation |> getInner(["field1", "field11"]);

    // Assert
    expect(result).toBe(innerValidation);
  });

  it("get inner validation should return success if path not found:", () => {
    // Arrange
    const errors = ["Err2", "Err1"];
    const innerValidation = Validation.Failure(errors);
    const validation = Validation.Failure([], {
      field1: Validation.Failure([], {
        field11: innerValidation
      })
    });

    var result = validation |> getInner(["notFoundField", "field11"]);

    // Assert
    expect(result).toBe(Validation.Success());
  });

  it("get errors on success should return empty array:", () => {
    // Arrange
    const validation = Validation.Success();

    var result = getErrors(validation);

    // Assert
    expect(result).toStrictEqual([]);
  });

  it("get errors:", () => {
    // Arrange
    const errors = ["Err2", "Err1"];
    const validation = Validation.Failure(errors);

    var result = getErrors(validation);

    // Assert
    expect(result).toStrictEqual(errors);
  });

  it("reference economy empty success: ", () => {
    // Arrange
    var success1 = Validation.Success();
    var success2 = Validation.Success();

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
