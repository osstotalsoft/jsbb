import { Validation } from "../validation";

describe("validation tests suite:", () => {
  it("monoid left identity law: ", () => {
    // Arrange
    var success = Validation.Success();
    var failure = Validation.Failure(["err1", "err2"], {
      a: Validation.Failure(["errA"])
    });

    // Act
    var result = Validation.all(success, failure);

    // Assert
    expect(result).toStrictEqual(failure);
  });

  it("monoid right identity law: ", () => {
    // Arrange
    var success = Validation.Success();
    var failure = Validation.Failure(["err1", "err2"], {
      a: Validation.Failure(["errA"])
    });

    // Act
    var result = Validation.all(failure, success);

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
    var result1 = Validation.all(Validation.all(failure1, failure2), failure3);
    var result2 = Validation.all(failure1, Validation.all(failure2, failure3));

    // Assert
    expect(result1).toStrictEqual(result2);
  });

  it("match success:", () => {
    // Arrange
    const validation = Validation.Success();

    // Act
    var isSuccess = Validation.match(validation, {
      Success: _ => true,
      Failure: _ => false
    });

    // Assert
    expect(isSuccess).toBe(true);
  });

  it("match errors:", () => {
    // Arrange
    const errors = ["Err1", "Err2"];
    const validation = Validation.Failure(errors);

    // Act
    var result = Validation.match(validation, {
      Success: _ => null,
      Failure: errors => errors
    });

    // Assert
    expect(result).toStrictEqual(errors);
  });

  it("match nested success:", () => {
    // Arrange
    const validation = Validation.Success({
      field1: Validation.Success()
    });

    // Act
    var isSuccess = Validation.match(validation, {
      Success: fields =>
        Validation.match(fields.field1, {
          Success: _ => true,
          Failure: _ => false
        }),
      Success: _ => true,
      Failure: _ => false
    });

    // Assert
    expect(isSuccess).toBe(true);
  });

  it("match nested errors:", () => {
    // Arrange
    const errors = ["Err2", "Err1"];
    const validation = Validation.Failure([], {
      field1: Validation.Failure(errors)
    });

    // Act
    var result = Validation.match(validation, {
      Success: _ => null,
      Failure: (_, fields) =>
        Validation.match(fields.field1, {
          Success: _ => null,
          Failure: errors => errors
        })
    });

    // Assert
    expect(result).toStrictEqual(errors);
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

    var result = Validation.getInner(validation, ["field1", "field11"]);

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

    var result = Validation.getInner(validation, ["notFoundField", "field11"]);

    // Assert
    expect(result).toBe(Validation.Success());
  });

  it("reference economy empty success: ", () => {
    // Arrange
    var success1 = Validation.Success();
    var success2 = Validation.Success();

    // Act
    var result = Validation.all(success1, success2);

    // Assert
    expect(result).toBe(success1);
    expect(result).toBe(success2);
  });

  /*it("reference economy second failure: ", () => {

        // Arrange
        var success =  Validation.Success()
        var failure =  Validation.Failure(["Err1", "Err 2"], {a: Validation.Success()})
        
        // Act
        var result = Validation.all(success, failure);

        // Assert
        expect(result).toBe(failure)
    });  */

  it("reference economy full: ", () => {
    // Arrange
    var failure1 = Validation.Failure(["err1"], {
      a: Validation.Failure(["errA1"], {
        aa: Validation.Failure(["errAA1", "errAA2"]),
        ab: Validation.Success()
      }),
      b: Validation.Success()
    });
    var failure2 = Validation.Failure(["err1"], {
      a: Validation.Failure(["errA1"], {
        aa: Validation.Failure(["errAA1", "errAA2"]),
        ab: Validation.Success()
      }),
      b: Validation.Success()
    });

    // Act
    var result = Validation.all(failure1, failure2);

    // Assert
    expect(result).toBe(failure1);
  });
});
