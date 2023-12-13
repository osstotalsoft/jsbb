// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { renderHook, act } from "@testing-library/react-hooks";
import { useChangeTrackingState } from "..";
import { __clearMocks } from "@totalsoft/change-tracking";


describe("useChangeTrackingState hook", () => {
    afterEach(() => {
        __clearMocks();
    });

    it("returns updated model on property change", () => {
        // Arrange
        const initialModel = { a: { b: "" } };

        // Act
        const { result } = renderHook(() => useChangeTrackingState(initialModel));
        act(() => {
            const [, , updateField] = result.current;
            updateField("OK", "a.b");
        });

        // Assert
        const [model] = result.current;
        expect(model._innerProp).toBe("OK");
    });

    it("returns updated model on model change", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const newModel = { a: { b: "OK" } }

        // Act
        const { result } = renderHook(() => useChangeTrackingState(initialModel));
        act(() => {
            const [, , update] = result.current;
            update(newModel);
        });

        // Assert
        const [model] = result.current;
        expect(model.a.b).toBe("OK");
    });

    it("enforces reference and render economy if updated with same value", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        let renderCount = 0;
        let callback = () => {
            renderCount = renderCount + 1;
            return useChangeTrackingState(initialModel);
        };

        // Act
        const { result } = renderHook(callback);
        act(() => {
            const [, , updateField] = result.current;
            updateField("OK", "a.b");

        });
        const [model1] = result.current;
        act(() => {
            const [, , updateField] = result.current;
            updateField("OK", "a.b");
        });
        const [model2] = result.current;
        // Assert
        expect(model1).toBe(model2);
        expect(model2._innerProp).toBe("OK");
        expect(renderCount).toBe(2);
    });

    it("returns initial model when update is not run", () => {
        // Arrange
        const initialModel = { a: { b: "" } };

        // Act
        const { result } = renderHook(() => useChangeTrackingState(initialModel));

        // Assert
        const [model] = result.current;
        expect(model).toBe(initialModel);

    });

    it("returns initial model after reset", () => {
        // Arrange
        const initialModel = { a: { b: "" } };

        // Act
        const { result } = renderHook(() => useChangeTrackingState(initialModel));
        act(() => {
            const [, , updateField] = result.current;
            updateField("OK", "a.b");
        });
        const [model1] = result.current;
        act(() => {
            const [, , , reset] = result.current;
            reset(initialModel);
        });

        // Assert
        const [model2] = result.current;
        expect(model1).not.toBe(initialModel);
        expect(model2).toBe(initialModel);
    });

    it("returns current model after reset without parameter", () => {
        // Arrange
        const initialModel = { a: { b: "" } };

        // Act
        const { result } = renderHook(() => useChangeTrackingState(initialModel));
        act(() => {
            const [, , updateField] = result.current;
            updateField("OK", "a.b");
        });
        const [model1] = result.current;
        act(() => {
            const [, , , reset] = result.current;
            reset();
        });

        // Assert
        const [model2] = result.current;
        expect(model1).not.toBe(initialModel);
        expect(model2).toBe(model1);
    });

    it("should minimize the number of renders", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        let renderNo = 0;
        function renderCallack() {
            renderNo = renderNo + 1;
            return useChangeTrackingState(initialModel);
        }

        // Act
        const { result, rerender } = renderHook(renderCallack);
        act(() => {
            const [, , updateField] = result.current;
            updateField("OK", "a.b");
        });
        rerender();

        // Assert
        expect(renderNo).toBe(3);
    });
    
    it("does not change the returned object references on re-render", () => {
        // Arrange
        const initialModel = { a: { b: "" } };

        // Act
        const { result, rerender } = renderHook(() => useChangeTrackingState(initialModel));
        const [model1, di1, update1, reset1] = result.current;
        rerender();
        const [model2, di2, update2, reset2] = result.current;

        // Assert
        expect(model1).toBe(model2);
        expect(di1).toBe(di2);
        expect(update1).toBe(update2);
        expect(reset1).toBe(reset2);
    });


    it("it doesn't change when when the initial model changes", () => {
        // Arrange
        const callback = () => useChangeTrackingState({});

        // Act
        const { result, rerender } = renderHook(callback);
        const [model1, rule1, update1, reset1] = result.current;
        rerender();
        const [model2, rule2, update2, reset2] = result.current;

        // Assert
        expect(model1).toBe(model2);
        expect(rule1).toBe(rule2);
        expect(update1).toBe(update2);
        expect(reset1).toBe(reset2);
    });
});
