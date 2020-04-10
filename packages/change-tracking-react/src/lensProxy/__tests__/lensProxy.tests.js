import { useProfunctorState } from '@staltz/use-profunctor-state'
import { renderHook, act } from "@testing-library/react-hooks";
import { LensProxy, eject, getValue, setValue, overValue } from "..";

describe("lens proxy", () => {
    it("eject returns inner profunctopr", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const profunctor = renderHook(() => useProfunctorState(initialModel));
        const proxy = LensProxy(profunctor)

        // Act
        const innerProfunctor = eject(proxy);

        // Assert
        expect(innerProfunctor).toBe(profunctor)
    });

    it("getValue returns profunctor state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const profunctor = renderHook(() => useProfunctorState(initialModel));
        const proxy = LensProxy(profunctor)

        // Act
        const value = getValue(proxy);

        // Assert
        expect(value).toBe(profunctor.state)
    });

    it("setValue sets the profunctor state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const otherModel = {};
        const {result} = renderHook(() => useProfunctorState(initialModel));
        const lensProxy = LensProxy(result.current)

        // Act
        act(() => {
            setValue(lensProxy)(otherModel);
        });

        // Assert
        expect(otherModel).toBe(result.current.state)
    });

    it("overValue modifies the profunctor state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const {result} = renderHook(() => useProfunctorState(initialModel));
        const lensProxy = LensProxy(result.current)
        const changeFn = x => x + "OK"

        // Act
        act(() => {
            overValue(lensProxy.a.b)(changeFn);
        });

        // Assert
        expect(result.current.state.a.b).toBe("OK")
    });

    it("inner field profunctor state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const callback = () => {
            const prof = useProfunctorState(initialModel)
            const profProxy = LensProxy(prof)
            const fieldProfProxy = profProxy.a.b;
            return fieldProfProxy;
        }
        const {result} = renderHook(callback);

        // Act
        act(() => {
            setValue(result.current, "OK")
        });

        // Assert
        expect(getValue(result.current)).toBe("OK");
    });
})