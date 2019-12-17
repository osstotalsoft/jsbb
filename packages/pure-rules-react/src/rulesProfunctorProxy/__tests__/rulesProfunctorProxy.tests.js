import { useProfunctorState } from '@staltz/use-profunctor-state'
import { renderHook, act } from "@testing-library/react-hooks";
import { RulesEngineProxy, eject, getValue, setValue } from "..";

jest.unmock("@totalsoft/pure-validations");

describe("validation proxy", () => {
    it("eject returns inner profunctopr", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const profunctor = renderHook(() => useProfunctorState(initialModel));
        const proxy = RulesEngineProxy(profunctor)

        // Act
        const innerProfunctor = eject(proxy);

        // Assert
        expect(innerProfunctor).toBe(profunctor)
    });

    it("getValue returns profunctor state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const profunctor = renderHook(() => useProfunctorState(initialModel));
        const proxy = RulesEngineProxy(profunctor)

        // Act
        const value = getValue(proxy);

        // Assert
        expect(value).toBe(profunctor.state)
    });

    it("onChange sets the profunctor state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const otherModel = {};
        const {result} = renderHook(() => useProfunctorState(initialModel));
        const profunctorProxy = RulesEngineProxy(result.current)

        // Act
        act(() => {
            setValue(profunctorProxy)(otherModel);
        });

        // Assert
        expect(otherModel).toBe(result.current.state)
    });

    it("inner field profunctor state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const callback = () => {
            const prof = useProfunctorState(initialModel)
            const profProxy = RulesEngineProxy(prof)
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