import { useProfunctorState } from '@staltz/use-profunctor-state'
import { renderHook, act } from "@testing-library/react-hooks";
import { LensProxy, eject, get, set, over, promap, lmap, rmap, sequence } from "..";

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

    it("get returns profunctor state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const profunctor = renderHook(() => useProfunctorState(initialModel));
        const proxy = LensProxy(profunctor)

        // Act
        const value = get(proxy);

        // Assert
        expect(value).toBe(profunctor.state)
    });

    it("set sets the profunctor state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const otherModel = {};
        const { result } = renderHook(() => useProfunctorState(initialModel));
        const lensProxy = LensProxy(result.current);

        // Act
        act(() => {
            set(lensProxy)(otherModel);
        });

        // Assert
        expect(otherModel).toBe(result.current.state)
    });

    it("set on property path containing nulls", () => {
        // Arrange
        const initialModel = { a: null, b: undefined };
        const { result } = renderHook(() => useProfunctorState(initialModel));
        const lensProxy = LensProxy(result.current)

        // Act
        act(() => {
            set(lensProxy.a.x)(1);
            set(lensProxy.b[0])(2);
        });

        // Assert
        expect(result.current.state.a.x).toBe(1);
        expect(result.current.state.b[0]).toBe(2);
    });

    it("set works just like over", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const { result } = renderHook(() => useProfunctorState(initialModel));
        const lensProxy = LensProxy(result.current)
        const changeFn = x => x + "OK"

        // Act
        act(() => {
            set(lensProxy.a.b)(changeFn);
        });

        // Assert
        expect(result.current.state.a.b).toBe("OK")
    });

    it("over modifies the profunctor state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const { result } = renderHook(() => useProfunctorState(initialModel));
        const lensProxy = LensProxy(result.current)
        const changeFn = x => x + "OK"

        // Act
        act(() => {
            over(lensProxy.a.b)(changeFn);
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
        const { result } = renderHook(callback);

        // Act
        act(() => {
            set(result.current, "OK");
        });

        // Assert
        expect(get(result.current)).toBe("OK");
    });

    it("can be stringified", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const { result } = renderHook(() => useProfunctorState(initialModel));
        const lensProxy = LensProxy(result.current)

        // Act
        JSON.stringify(lensProxy);

        // Assert
    });

    it("can be set like a pojo", () => {
        // Arrange
        const initialModel = { a: { b: 0 } };
        const { result } = renderHook(() => useProfunctorState(initialModel));
        const lensProxy = LensProxy(result.current);

        // Act
        act(() => {
            lensProxy.a.b = 1;
        });

        // Assert
        expect(result.current.state.a.b).toBe(1);
    });

    it("promap proxy", () => {
        // Arrange
        const initialModel = { a: { b: "" } }
        const otherModel = {};
        const { result } = renderHook(() => useProfunctorState(initialModel))
        const proxy = LensProxy(result.current) |> promap(
            x => x.a,
            (fieldValue, model) => ({ ...model, a: fieldValue })
        )

        // Assert
        const value = proxy |> get
        expect(value).toBe(initialModel.a)

        // Act
        act(() => {
            set(proxy, otherModel)
        });

        // Assert
        expect(result.current.state.a).toBe(otherModel)
    });

    it("lmap proxy", () => {
        // Arrange
        const initialModel = { a: null }
        const { result } = renderHook(() => useProfunctorState(initialModel))
        const proxy = LensProxy(result.current).a |> lmap(x => x || "")

        // Assert
        const value = proxy |> get
        expect(value).toBe("")

        // Act
        act(() => {
            set(proxy, 1)
        });

        // Assert
        expect(result.current.state.a).toBe(1)
    });

    it("rmap proxy", () => {
        // Arrange
        const initialModel = { a: "some" }
        const { result } = renderHook(() => useProfunctorState(initialModel))
        const proxy = LensProxy(result.current).a |> rmap(x => x || "other")

        // Assert
        const value = proxy |> get
        expect(value).toBe("some")

        // Act
        act(() => {
            set(proxy, null)
        });

        // Assert
        expect(result.current.state.a).toBe("other")
    });

    it("sequence proxy of array", () => {
        // Arrange
        const initialModel = [1,2,3]
        const { result } = renderHook(() => useProfunctorState(initialModel))
        const proxy = LensProxy(result.current)

        // Act
        const proxies = proxy |> sequence
        const secondItemProxy = proxies[1]
        expect(secondItemProxy |> get).toBe(initialModel[1])
        act(() => {
            set(secondItemProxy, 22)
        });

        // Assert
        expect(result.current.state).toEqual([1,22,3])
    });
})