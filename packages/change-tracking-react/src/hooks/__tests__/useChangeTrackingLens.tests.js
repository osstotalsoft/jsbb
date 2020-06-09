import { renderHook, act } from "@testing-library/react-hooks";
import { set, get, eject } from "@totalsoft/state-lens-react";
import { useChangeTrackingLens } from "..";
import { detectChanges, __clearMocks as clearChangeTrackingMocks } from "@totalsoft/change-tracking";

describe("useChangeTrackingLens hook", () => {
    afterEach(() => {
        clearChangeTrackingMocks();
    });

    it("returns model with updated property", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const callback = () => {
            const [rootProf] = useChangeTrackingLens(initialModel)

            return { rootProf, fieldProf: rootProf.a.b };
        }
        
        // Act
        const { result } = renderHook(callback);
        act(() => {
            set(result.current.fieldProf)("OK");
        });

        // Assert
        const root = get(result.current.rootProf);
        const field = get(result.current.fieldProf);
        expect(field).toBe("OK");
        expect(root.a.b).toBe("OK");
        expect(root).not.toBe(initialModel);
    });

    it("returns model with rule applied to it inside loop", () => {
        // Arrange
        const initialModel = { a: [1, 2, 3] };
        const callback = () => {
            const [rootProf] = useChangeTrackingLens( initialModel)

            let array = get(rootProf.a)
            let fieldProfs = array.map((item, idx) => rootProf.a[idx]);

            return { rootProf, fieldProfs };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            set(result.current.fieldProfs[0])("OK");
        });

        // Assert
        const root = get(result.current.rootProf);
        const field = get(result.current.fieldProfs[0]);
        expect(field).toBe("OK");
        expect(root.a[0]).toBe("OK");
        expect(root).not.toBe(initialModel);
    });

    it("sets dirty info", () => {
        // Arrange
        const initialModel = { a: { b: "", c: "Initial" } };
        const callback = () => {
            const [rootProf, di] = useChangeTrackingLens( initialModel)

            return { rootProf, fieldProf: rootProf.a.b, di };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            set(result.current.fieldProf)("OK");
        });

        // Assert
        const dirtyInfo = result.current.di;
        expect(dirtyInfo).toStrictEqual(detectChanges({  a: { b: "OK", c: "Initial" } }, initialModel))
    });


    it("enforces reference and render economy if updated with same value", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        let renderCount = 0;

        const callback = () => {
            const [rootProf] = useChangeTrackingLens(initialModel)
            renderCount = renderCount + 1;
            return { rootProf, fieldProf: rootProf.a.b };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            set(result.current.fieldProf)("OK");
        });
        const model1 = result.current.rootProf;
        act(() => {
            set(result.current.fieldProf)("OK");
        });
        const model2 = result.current.rootProf;
        
        // Assert
        expect(model1).toBe(model2);
        expect(renderCount).toBe(3)
    });


    it("returns initial model when not changed", () => {
        // Arrange
        const initialModel = { a: { b: "" } };

        // Act
        const { result } = renderHook(() => useChangeTrackingLens( initialModel));

        // Assert
        const [model] = result.current;
        expect(get(model)).toBe(initialModel);

    });


    it("returns initial model after reset", () => {
        // Arrange
        const initialModel = { a: { b: "" } };

        const callback = () => {
            const [rootProf, , resetFunc] = useChangeTrackingLens(initialModel)

            return { rootProf, fieldProf: rootProf.a.b, resetFunc };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            const { fieldProf } = result.current;
            set(fieldProf, "OK")
        });
        const { rootProf: rootProf1 } = result.current;
        act(() => {
            const { resetFunc } = result.current;
            resetFunc(initialModel);
        });

        // Assert
        const { rootProf: rootProf2 } = result.current;
        expect(get(rootProf1)).not.toBe(initialModel);
        expect(get(rootProf2)).toBe(initialModel);
    });

    it("should minimize the number of renders", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        let renderNo = 0;
        function renderCallack() {
            renderNo = renderNo + 1;
            const [rootProf] = useChangeTrackingLens(initialModel)
            return { rootProf, fieldProf: rootProf.a.b, };
        }

        // Act
        const { result, rerender } = renderHook(renderCallack);
        act(() => {
            const { fieldProf } = result.current;
            set(fieldProf, "OK")
        });
        rerender();

        // Assert
        expect(renderNo).toBe(3);
    });


    it("does not change the returned object references on re-render", () => {
        // Arrange
        const initialModel = { a: { b: "" } };

        // Act
        const { result, rerender } = renderHook(() => useChangeTrackingLens(initialModel));
        const [prof1, dirtyInfo1, reset1] = result.current;
        rerender();
        const [prof2, dirtyInfo2, reset2] = result.current;

        // Assert
        expect(prof1).toBe(prof2);
        expect(dirtyInfo1).toBe(dirtyInfo2);
        expect(reset1).toBe(reset2);
    });

    it("it doesn't change when when the initial model changes", () => {
        // Arrange
        const callback = () => useChangeTrackingLens({});

        // Act
        const { result, rerender } = renderHook(callback);
        const [prof1, dirtyInfo1, reset1] = result.current;
        rerender();
        const [prof2, dirtyInfo2, reset2] = result.current;

        // Assert
        expect(prof1).toBe(prof2);
        expect(dirtyInfo1).toBe(dirtyInfo2);
        expect(reset1).toBe(reset2);
    });
});
