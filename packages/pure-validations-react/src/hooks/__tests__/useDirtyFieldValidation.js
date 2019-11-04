import { renderHook, act } from "@testing-library/react-hooks";
import { useDirtyFieldValidation } from "../";
import { Validator, Success, Failure, isValid, validate, __clearMocks } from "@totalsoft/pure-validations";
import { eject } from "../../validationProxy";

describe("UseDirtyFieldValidaiton hook", () => {
  afterEach(() => {
    __clearMocks();
  });

  it("should minimize the number of renders", () => {
    // Arrange
    const validator = Validator.of(Success);
    const model = { field: "test" };
    let renderNo = 0;
    function renderCallack() {
      renderNo = renderNo + 1;
      return useDirtyFieldValidation(validator);
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

  it("should validate dirty fields", () => {
    // Arrange
    const validator = Validator.of(Success);
    const model = { field: "" };
    const dirtyInfo = { field: true };

    // Act
    const { result } = renderHook(() => useDirtyFieldValidation(validator));
    act(() => {
      const [, validate] = result.current;
      validate(model, dirtyInfo);
    });

    // Assert
    expect(validate.mock.calls[0][2].dirtyInfo).toBe(dirtyInfo);
  });

  it("should validate all fields", () => {
    // Arrange
    const validator = Validator.of(Success);
    const model = {};

    // Act
    const { result } = renderHook(() => useDirtyFieldValidation(validator));
    act(() => {
      const [, validate] = result.current;
      validate(model);
    });

    // Assert
    expect(validate.mock.calls[0][2].dirtyInfo).toBe(undefined);
  });

  it("should not use dirty info after full validation", () => {
    // Arrange
    const validator = Validator.of(Success);
    const model = {};
    const dirtyInfo = { field: true };

    // Act
    const { result } = renderHook(() => useDirtyFieldValidation(validator));
    act(() => {
      const [, validate] = result.current;
      validate(model);
    });

    act(() => {
      const [, validate] = result.current;
      validate(model, dirtyInfo);
    });

    // Assert
    expect(validate.mock.calls[0][2].dirtyInfo).toBe(undefined);
    expect(validate.mock.calls[1][2].dirtyInfo).toBe(undefined);
  });

  it("should use dirty info after reset", () => {
    // Arrange
    const validator = Validator.of(Success);
    const model = {};
    const dirtyInfo = {};

    // Act
    const { result } = renderHook(() => useDirtyFieldValidation(validator));
    act(() => {
      const [, validate] = result.current;
      validate(model);
    });

    act(() => {
      const [, , reset] = result.current;
      reset();
    });

    act(() => {
      const [, validate] = result.current;
      validate(model, dirtyInfo);
    });

    // Assert
    expect(validate.mock.calls[0][2].dirtyInfo).toBe(undefined);
    expect(validate.mock.calls[1][2].dirtyInfo).toBe(dirtyInfo);
  });

  it("returns success when validation result is success", () => {
    // Arrange
    const validator = Validator.of(Success);
    const model = {};
    const dirtyInfo = {};
    let returnedIsValid = undefined;

    // Act
    const { result } = renderHook(() => useDirtyFieldValidation(validator));
    act(() => {
      const [, validate] = result.current;
      returnedIsValid = validate(model, dirtyInfo);
    });

    // Assert
    const [validation] = result.current;
    expect(isValid.mock.calls.length).toBe(0); // Success proxy uses an initialized cache
    expect(validate.mock.calls.length).toBe(1);
    expect(isValid(validation)).toBe(true);
    expect(returnedIsValid).toBe(true);
  });

  it("returns failure when validation result is failure", () => {
    // Arrange
    const validator = Validator.of(Failure());
    const model = {};
    let returnedIsValid = undefined;
    const dirtyInfo = {};

    // Act
    const { result } = renderHook(() => useDirtyFieldValidation(validator));
    act(() => {
      const [, validate] = result.current;
      returnedIsValid = validate(model, dirtyInfo);
    });

    // Assert
    const [validation] = result.current;
    expect(isValid.mock.calls.length).toBe(1);
    expect(validate.mock.calls.length).toBe(1);
    expect(isValid(validation)).toBe(false);
    expect(returnedIsValid).toBe(false);
  });

  it("does not change the returned object references on re-render", () => {
    // Arrange
    const validator = Validator.of(Success);

    // Act
    const { result, rerender } = renderHook(() => useDirtyFieldValidation(validator, {}));
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
    const callback = () => useDirtyFieldValidation(Validator.of(Success));

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

  it("changes the validation function when the mode (full, dirtyOnly) changes", () => {
    // Arrange
    const model = {};
    const validator = Validator.of(Success);
    const callback = () => useDirtyFieldValidation(validator);

    // Act
    const { result } = renderHook(callback);
    const [validation1, validate1, reset1] = result.current;
    act(() => {
      validate1(model);
    });
    const [validation2, validate2, reset2] = result.current;

    // Assert
    expect(eject(validation1)).toBe(eject(validation2));
    expect(validate1).not.toBe(validate2);
    expect(reset1).toBe(reset2);
    expect(validate.mock.calls.length).toBe(1);
  });
});
