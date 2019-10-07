import { renderHook, act } from "@testing-library/react-hooks";
import { useValidation } from "../useValidation";
import { isValid, Validator, Success, Failure, validate, logTo, filterFields, __clearMocks } from "@totalsoft/pure-validations";

describe("useValidation hook", () => {
  afterEach(() => {
    __clearMocks();
  });

  it("returns success when validation result is success", () => {
    // Arrange
    const validator = Validator.of(Success);
    const model = {};
    let returnedIsValid = undefined;

    // Act
    const { result } = renderHook(() => useValidation(validator));
    act(() => {
      const [, validate] = result.current;
      returnedIsValid = validate(model);
    });

    // Assert
    const [validation] = result.current;
    expect(isValid.mock.calls.length).toBe(1);
    expect(validate.mock.calls.length).toBe(1);
    expect(isValid(validation)).toBe(true);
    expect(returnedIsValid).toBe(true);
  });

  it("returns failure when validation result is failure", () => {
    // Arrange
    const validator = Validator.of(Failure());
    const model = {};
    let returnedIsValid = undefined;

    // Act
    const { result } = renderHook(() => useValidation(validator));
    act(() => {
      const [, validate] = result.current;
      returnedIsValid = validate(model);
    });

    // Assert
    const [validation] = result.current;
    expect(isValid.mock.calls.length).toBe(1);
    expect(validate.mock.calls.length).toBe(1);
    expect(isValid(validation)).toBe(false);
    expect(returnedIsValid).toBe(false);
  });

  it("returns success when validation is not run", () => {
    // Arrange
    const validator = Validator.of(Failure());

    // Act
    const { result } = renderHook(() => useValidation(validator));

    // Assert
    const [validation] = result.current;
    expect(isValid(validation)).toBe(true);
  });

  it("returns success after reset", () => {
    // Arrange
    const validator = Validator.of(Failure());
    const model = {};

    // Act
    const { result } = renderHook(() => useValidation(validator));
    act(() => {
      const [, validate] = result.current;
      validate(model);
    });
    const [validation1] = result.current;

    act(() => {
      const [, , reset] = result.current;
      reset();
    });

    // Assert
    const [validation2] = result.current;
    expect(isValid(validation1)).toBe(false);
    expect(isValid(validation2)).toBe(true);
  });

  it("should minimize the number of renders", () => {
    // Arrange
    const validator = Validator.of(Failure());
    const model = {};
    let renderNo = 0;
    function renderCallack() {
      renderNo = renderNo + 1;
      return useValidation(validator);
    }

    // Act
    const { result, rerender } = renderHook(renderCallack);
    act(() => {
      const [, validate] = result.current;
      validate(model);
    });
    rerender();

    // Assert
    expect(renderNo).toBe(3);
  });

  it("calls the logTo HOV function once", () => {
    // Arrange
    const validator = Validator.of(Success);
    const logger = { log: _ => {} };
    const model = {};

    // Act
    const { result } = renderHook(() => useValidation(validator, { isLogEnabled: true, logger }));
    act(() => {
      const [, validate] = result.current;
      validate(model);
    });

    // Assert
    expect(logTo.mock.calls).toEqual([[logger]]);
  });

  it("calls filterFields HOV function once", () => {
    // Arrange
    const validator = Validator.of(Success);
    const filterFn = _ => true;
    const model = {};

    // Act
    const { result } = renderHook(() => useValidation(validator, { fieldFilterFunc: filterFn }));
    act(() => {
      const [, validate] = result.current;
      validate(model);
    });

    // Assert
    expect(filterFields.mock.calls).toEqual([[filterFn]]);
  });

  it("does not change the returned object references on re-render", () => {
    // Arrange
    const validator = Validator.of(Success);

    // Act
    const { result, rerender } = renderHook(() => useValidation(validator, {}));
    const [validation1, validate1, reset1] = result.current;
    rerender();
    const [validation2, validate2, reset2] = result.current;

    // Assert
    expect(validation1).toBe(validation2);
    expect(validate1).toBe(validate2);
    expect(reset1).toBe(reset2);
  });

  it("changes the validation function when the validator changes", () => {
    // Arrange
    const callback = () => useValidation(Validator.of(Success), { logger: {} });

    // Act
    const { result, rerender } = renderHook(callback);
    const [validation1, validate1, reset1] = result.current;
    rerender();
    const [validation2, validate2, reset2] = result.current;

    // Assert
    expect(validation1).toBe(validation2);
    expect(validate1).not.toBe(validate2);
    expect(reset1).toBe(reset2);
  });

  it("changes the validation function when the logger changes", () => {
    // Arrange
    const validator = Validator.of(Success);
    const callback = () => useValidation(validator, { logger: {} });

    // Act
    const { result, rerender } = renderHook(callback);
    const [validation1, validate1, reset1] = result.current;
    rerender();
    const [validation2, validate2, reset2] = result.current;

    // Assert
    expect(validation1).toBe(validation2);
    expect(validate1).not.toBe(validate2);
    expect(reset1).toBe(reset2);
  });

  it("changes the validation function when the logging flag changes", () => {
    // Arrange
    const validator = Validator.of(Success);
    let isLogEnabled = true;
    function callback() {
      isLogEnabled = !isLogEnabled;
      return useValidation(validator, { isLogEnabled: !isLogEnabled });
    }

    // Act
    const { result, rerender } = renderHook(callback);
    const [validation1, validate1, reset1] = result.current;
    rerender();
    const [validation2, validate2, reset2] = result.current;

    // Assert
    expect(validation1).toBe(validation2);
    expect(validate1).not.toBe(validate2);
    expect(reset1).toBe(reset2);
  });

  it("changes the validation function when the filter fuction changes", () => {
    // Arrange
    const validator = Validator.of(Success);
    const callback = () => useValidation(validator, { fieldFilterFunc: () => {} });

    // Act
    const { result, rerender } = renderHook(callback);
    const [validation1, validate1, reset1] = result.current;
    rerender();
    const [validation2, validate2, reset2] = result.current;

    // Assert
    expect(validation1).toBe(validation2);
    expect(validate1).not.toBe(validate2);
    expect(reset1).toBe(reset2);
  });

  it("changes the validation function when other deps change", () => {
    // Arrange
    const validator = Validator.of(Success);
    let depFlag = true;
    function callback() {
      depFlag = !depFlag;
      return useValidation(validator, {}, [depFlag]);
    }

    // Act
    const { result, rerender } = renderHook(callback);
    const [validation1, validate1, reset1] = result.current;
    rerender();
    const [validation2, validate2, reset2] = result.current;

    // Assert
    expect(validation1).toBe(validation2);
    expect(validate1).not.toBe(validate2);
    expect(reset1).toBe(reset2);
  });
});
