import { LensProxy, eject, get, set, over, promap, lmap, rmap, sequence, pipe } from "..";
import LensState from "../../lensState";
import * as R from "ramda";

describe("lens proxy", () => {
    it("eject returns inner lensStateunctopr", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const lensState = LensState(initialModel, _ => { });
        const proxy = LensProxy(lensState)

        // Act
        const innerLensState = eject(proxy);

        // Assert
        expect(innerLensState).toBe(lensState)
    });

    it("get returns lensState state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const lensState = LensState(initialModel, _ => { })
        const proxy = LensProxy(lensState)

        // Act
        const value = get(proxy);

        // Assert
        expect(value).toBe(lensState.state)
    });

    it("set sets the lensState state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const otherModel = {};
        const lensState = LensState(initialModel, newValue => { lensState.state = newValue })
        const lensProxy = LensProxy(lensState);

        // Act
        set(lensProxy)(otherModel);

        // Assert
        expect(otherModel).toBe(lensState.state)
    });

    it("set on property path containing nulls", () => {
        // Arrange
        const initialModel = { a: null, b: undefined };
        const lensState = LensState(initialModel, setter => { lensState.state = setter(lensState.state) })
        const lensProxy = LensProxy(lensState)

        // Act
        set(lensProxy.a.x)(1);
        set(lensProxy.b[0])(2);

        // Assert
        expect(lensState.state.a.x).toBe(1);
        expect(lensState.state.b[0]).toBe(2);
    });

    it("set works just like over", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const lensState = LensState(initialModel, setter => { lensState.state = setter(lensState.state) })
        const lensProxy = LensProxy(lensState)
        const changeFn = x => x + "OK"

        // Act
        set(lensProxy.a.b)(changeFn);

        // Assert
        expect(lensState.state.a.b).toBe("OK")
    });

    it("over modifies the lens state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const lensState = LensState(initialModel, setter => { lensState.state = setter(lensState.state) })
        const lensProxy = LensProxy(lensState)
        const changeFn = x => x + "OK"

        // Act
        over(lensProxy.a.b)(changeFn);

        // Assert
        expect(lensState.state.a.b).toBe("OK")
    });

    it("inner field lens state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        let lensState = undefined
        let lens = undefined
        let setState = (setter) => {
            lensState = new LensState(setter(lensState.state), setState)
            lens = LensProxy(lensState)
        }
        lensState = new LensState(initialModel, setState)
        lens = LensProxy(lensState)

        // Act
        set(lens.a.b, "OK");

        // Assert
        expect(get(lens.a.b)).toBe("OK");
    });

    it("can be stringified", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const lensState = LensState(initialModel, _ => { })
        const lensProxy = LensProxy(lensState)

        // Act
        JSON.stringify(lensProxy);
        // Assert
    });

    it("promap proxy", () => {
        // Arrange
        const initialModel = { a: { b: "" } }
        const otherModel = {};
        const lensState = LensState(initialModel, setter => { lensState.state = setter(lensState.state) })
        const proxy = LensProxy(lensState) |> promap(
            x => x.a,
            (fieldValue, model) => ({ ...model, a: fieldValue })
        )

        // Assert
        const value = proxy |> get
        expect(value).toBe(initialModel.a)

        // Act
        set(proxy, otherModel)

        // Assert
        expect(lensState.state.a).toBe(otherModel)
    });

    it("pipe with ramda lens", () => {
        // Arrange
        const initialModel = { a: { b: "" } }
        const otherModel = {};
        const lensState = LensState(initialModel, setter => { lensState.state = setter(lensState.state) })
        const lensProxy = LensProxy(lensState)
        const pipedProxy = pipe(lensProxy, R.lens(
            R.prop("a"),
            R.assoc("a")
        ))

        // Assert
        const value = pipedProxy |> get
        expect(value).toBe(initialModel.a)

        // Act
        set(pipedProxy, otherModel)

        // Assert
        expect(lensState.state.a).toBe(otherModel)
    });

    it("lmap proxy", () => {
        // Arrange
        const initialModel = { a: null }
        const lensState = LensState(initialModel, setter => { lensState.state = setter(lensState.state) })
        const proxy = LensProxy(lensState).a |> lmap(x => x || "")

        // Assert
        const value = proxy |> get
        expect(value).toBe("")

        // Act
        set(proxy, 1)

        // Assert
        expect(lensState.state.a).toBe(1)
    });

    it("rmap proxy", () => {
        // Arrange
        const initialModel = { a: "some" }
        const lensState = LensState(initialModel, setter => { lensState.state = setter(lensState.state) })
        const proxy = LensProxy(lensState).a |> rmap(x => x || "other")

        // Assert
        const value = proxy |> get
        expect(value).toBe("some")

        // Act
        set(proxy, null)

        // Assert
        expect(lensState.state.a).toBe("other")
    });

    it("sequence proxy of array", () => {
        // Arrange
        const initialModel = [1, 2, 3]

        const lensState = LensState(initialModel, setter => { lensState.state = setter(lensState.state) })
        const proxy = LensProxy(lensState)

        // Act
        const proxies = proxy |> sequence
        const secondItemProxy = proxies[1]
        expect(secondItemProxy |> get).toBe(initialModel[1])

        set(secondItemProxy, 22)


        // Assert
        expect(lensState.state).toEqual([1, 22, 3])
    });
})