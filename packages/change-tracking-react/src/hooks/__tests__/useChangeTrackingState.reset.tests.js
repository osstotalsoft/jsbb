// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { renderHook, act } from "@testing-library/react-hooks";
import { isPropertyDirty, isDirty } from "@totalsoft/change-tracking";
import { useChangeTrackingState } from "..";
jest.unmock("@totalsoft/change-tracking");

describe("useChangeTrackingState hook - reset", () => {
  it("computes the new model from the pending model with an updater fn", () => {
    // Arrange
    const initialModel = { a: { b: "" }, status: "Draft" };
    const { result } = renderHook(() => useChangeTrackingState(initialModel));

    // Act
    act(() => {
      const [, , , reset] = result.current;
      reset((prev) => ({ ...prev, status: "Active" }));
    });

    // Assert
    const [model, dirtyInfo] = result.current;
    expect(model).toStrictEqual({ a: { b: "" }, status: "Active" });
    expect(isDirty(dirtyInfo)).toBe(false);
  });

  it("with keepDirtyInfo and an updater fn, merges into a pending edit made in the same batch", () => {
    // Arrange
    const initialModel = { a: { b: "" }, status: "Draft" };
    const { result } = renderHook(() => useChangeTrackingState(initialModel));

    // Act
    act(() => {
      const [, , update, reset] = result.current;
      update("OK", "a.b");
      reset((prev) => ({ ...prev, status: "Active" }), { keepDirtyInfo: true });
    });

    // Assert
    const [model, dirtyInfo] = result.current;
    expect(model).toStrictEqual({ a: { b: "OK" }, status: "Active" });
    expect(isPropertyDirty("a.b", dirtyInfo)).toBe(true);
    expect(isPropertyDirty("status", dirtyInfo)).toBe(false);
  });

  it("with an updater fn, tracks later edits of array items it added", () => {
    // Arrange
    const initialModel = { items: [{ id: 1, value: "a" }] };
    const { result } = renderHook(() => useChangeTrackingState(initialModel));
    act(() => {
      const [, , , reset] = result.current;
      reset((prev) => ({ ...prev, items: [...prev.items, { id: 2, value: "b" }] }), { keepDirtyInfo: true });
    });

    // Act
    act(() => {
      const [, , update] = result.current;
      update("c", "items.1.value");
    });

    // Assert
    const [model, dirtyInfo] = result.current;
    expect(model.items[1].value).toBe("c");
    expect(isPropertyDirty("items.1.value", dirtyInfo)).toBe(true);
    expect(isPropertyDirty("items.1.id", dirtyInfo)).toBe(false);
    expect(isPropertyDirty("items.0.value", dirtyInfo)).toBe(false);
  });

  it("with keepDirtyInfo, sets the model and keeps the existing dirty flags", () => {
    // Arrange
    const initialModel = { a: { b: "" }, status: "Draft" };
    const { result } = renderHook(() => useChangeTrackingState(initialModel));
    act(() => {
      const [, , update] = result.current;
      update("OK", "a.b");
    });
    const [model1, dirtyInfo1] = result.current;

    // Act
    act(() => {
      const [, , , reset] = result.current;
      reset({ ...model1, status: "Active" }, { keepDirtyInfo: true });
    });

    // Assert
    const [model2, dirtyInfo2] = result.current;
    expect(model2).toStrictEqual({ a: { b: "OK" }, status: "Active" });
    expect(dirtyInfo2).toBe(dirtyInfo1);
    expect(isPropertyDirty("a.b", dirtyInfo2)).toBe(true);
    expect(isPropertyDirty("status", dirtyInfo2)).toBe(false);
  });

  it("with keepDirtyInfo, does not mark a clean model dirty and later edits mark only the edited field", () => {
    // Arrange
    const initialModel = { a: { b: "" }, status: "Draft" };
    const { result } = renderHook(() => useChangeTrackingState(initialModel));

    // Act
    act(() => {
      const [, , , reset] = result.current;
      reset({ ...initialModel, status: "Active" }, { keepDirtyInfo: true });
    });
    const [, dirtyInfo1] = result.current;
    act(() => {
      const [, , update] = result.current;
      update("OK", "a.b");
    });

    // Assert
    const [model, dirtyInfo2] = result.current;
    expect(isDirty(dirtyInfo1)).toBe(false);
    expect(model).toStrictEqual({ a: { b: "OK" }, status: "Active" });
    expect(isPropertyDirty("a.b", dirtyInfo2)).toBe(true);
    expect(isPropertyDirty("status", dirtyInfo2)).toBe(false);
  });

  it("still clears the dirty info without the option", () => {
    // Arrange
    const initialModel = { a: { b: "" } };
    const { result } = renderHook(() => useChangeTrackingState(initialModel));
    act(() => {
      const [, , update] = result.current;
      update("OK", "a.b");
    });

    // Act
    act(() => {
      const [, , , reset] = result.current;
      reset();
    });

    // Assert
    const [, dirtyInfo] = result.current;
    expect(isDirty(dirtyInfo)).toBe(false);
  });
});
