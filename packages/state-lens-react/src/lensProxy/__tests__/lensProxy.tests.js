import { LensProxy, eject, get, set, over, promap, lmap, rmap, sequence, pipe } from "..";
import LensState from "../../lensState";
import * as R from "ramda";

describe("lens proxy", () => {
    it("eject returns inner lensState profunctor", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const lensState = LensState(initialModel, _ => { })
        const proxy = LensProxy(lensState)

        // Act
        const innerLensState = eject(proxy);

        // Assert
        expect(innerLensState).toBe(lensState)
    });

    it("get returns lensState state", () => {
        // Arrange
        const state = { a: { b: "" } };
        const lensState = LensState(state, _ => { })
        const proxy = LensProxy(lensState)

        // Act
        const value = get(proxy);

        // Assert
        expect(value).toBe(state)
    });

    it("set sets the lensState state", () => {
        // Arrange
        let state = { a: { b: "" } };
        const otherModel = {};
        const setState = value => { state = value }
        const lensStateProxy = LensState(state, setState) |> LensProxy

        // Act
        set(lensStateProxy)(otherModel);

        // Assert
        expect(otherModel).toBe(state)
    });

    it("set on property path containing nulls", () => {
        // Arrange
        let state = { a: null, b: undefined };
        const setState = setter => { state = setter(state) }
        const lensStateProxy = LensState(state, setState) |> LensProxy

        // Act
        set(lensStateProxy.a.x)(1);
        set(lensStateProxy.b[0])(2);

        // Assert
        expect(state.a.x).toBe(1);
        expect(state.b[0]).toBe(2);
    });

    it("set works just like over", () => {
        // Arrange
        let state = { a: { b: "" } };
        const setState = setter => { state = setter(state) }
        const lensStateProxy = LensState(state, setState) |> LensProxy
        const changeFn = x => x + "OK"

        // Act
        set(lensStateProxy.a.b)(changeFn);

        // Assert
        expect(state.a.b).toBe("OK")
    });

    it("over modifies the lens state", () => {
        // Arrange
        let state = { a: { b: "" } };
        const setState = setter => { state = setter(state) }
        const lensStateProxy = LensState(state, setState) |> LensProxy
        const changeFn = x => x + "OK"

        // Act
        over(lensStateProxy.a.b)(changeFn);

        // Assert
        expect(state.a.b).toBe("OK")
    });


    it("inner field lens state setter", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const setState = jest.fn()
        const lens = new LensState(initialModel, setState) |> LensProxy
        
        // Act
        set(lens.a.b, "OK");      

        // Assert
        expect(setState.mock.calls.length).toBe(1);
        const setter = setState.mock.calls[0][0]
        expect(setter(initialModel).a.b).toBe("OK");
    });

    it("inner field lens state 3", () => {
        // Arrange
        let model = { a: { b: "" } };
        const setState = setter => model = setter(model)
        const lens = new LensState(model, setState) |> LensProxy
        
        // Act
        set(lens.a.b, "OK");      

        // Assert
        expect(model.a.b).toBe("OK");
    });


    it("can be stringified", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const lensStateProxy = LensState(initialModel, _ => { }) |> LensProxy
        
        // Act
        JSON.stringify(lensStateProxy);
        // Assert
    });

    it("promap proxy", () => {
        // Arrange
        let state = { a: { b: "" } }
        const setState = setter => { state = setter(state) }
        const otherModel = {};
        const lensStateProxy = LensState(state, setState) |> LensProxy
        const proxy = lensStateProxy |> promap(
            x => x.a,
            (fieldValue, model) => ({ ...model, a: fieldValue })
        )

        // Assert
        const value = proxy |> get
        expect(value).toBe(state.a)

        // Act
        set(proxy, otherModel)

        // Assert
        expect(state.a).toBe(otherModel)
    });

    it("pipe with ramda lens", () => {
        // Arrange
        let state = { a: { b: "" } }
        const setState = setter => { state = setter(state) }
        const otherModel = {};
        const lensStateProxy = LensState(state, setState) |> LensProxy
        
        const pipedProxy = pipe(lensStateProxy, R.lens(
            R.prop("a"),
            R.assoc("a")
        ))

        // Assert
        const value = pipedProxy |> get
        expect(value).toBe(state.a)

        // Act
        set(pipedProxy, otherModel)

        // Assert
        expect(state.a).toBe(otherModel)
    });

    it("lmap proxy", () => {
        // Arrange
        let state = { a: null }
        const setState = setter => { state = setter(state) }
        const lensStateProxy = LensState(state, setState) |> LensProxy
        const innerLensProxy = lensStateProxy.a |> lmap(x => x || "")

        // Assert
        const value = innerLensProxy |> get
        expect(value).toBe("")

        // Act
        set(innerLensProxy, 1)

        // Assert
        expect(state.a).toBe(1)
    });

    it("rmap proxy", () => {
        // Arrange
        let state = {a: "some"}
        const setState = setter => { state = setter(state) }
        const lensStateProxy = LensState(state, setState) |> LensProxy
        const innerLensProxy = lensStateProxy.a |> rmap(x => x || "other")

        // Assert
        const value = innerLensProxy |> get
        expect(value).toBe("some")

        // Act
        set(innerLensProxy, null)

        // Assert
        expect(state.a).toBe("other")
    });

    it("sequence proxy of array", () => {
        // Arrange
        let state = [1, 2, 3]
        const setState = setter => { state = setter(state) }
        const lensState = LensState(state, setState)
        const proxy = LensProxy(lensState)

        // Act
        const proxies = proxy |> sequence
        const secondItemProxy = proxies[1]
        expect(secondItemProxy |> get).toBe(state[1])

        set(secondItemProxy, 22)

        // Assert
        expect(state).toEqual([1, 22, 3])
    });
})