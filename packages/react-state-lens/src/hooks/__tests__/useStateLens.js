// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { renderHook, act } from "@testing-library/react-hooks";
import { set, get } from "../../lensProxy";
import { useStateLens } from "..";

describe("useStateLens hook", () => {
    it("returns model with updated property", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const callback = () => {
            const rootProf = useStateLens(initialModel)

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
            const rootProf = useStateLens(initialModel)

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


    it("should minimize the number of renders", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        let renderNo = 0;
        function renderCallack() {
            renderNo = renderNo + 1;
            const rootProf = useStateLens(initialModel)
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
        const { result, rerender } = renderHook(() => useStateLens(initialModel));
        const prof1 = result.current;
        rerender();
        const prof2 = result.current;

        // Assert
        expect(prof1).toBe(prof2);
    });

    it("it doesn't change when when the initial model changes", () => {
        // Arrange
        const callback = () => useStateLens({});

        // Act
        const { result, rerender } = renderHook(callback);
        const prof1 = result.current;
        rerender();
        const prof2 = result.current;

        // Assert
        expect(prof1).toBe(prof2);
    });
});
