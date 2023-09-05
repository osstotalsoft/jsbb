// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { LensProxy, eject, get, set, over, promap, lmap, rmap, sequence, pipe } from "..";
import StateLens from "../../stateLens";
import * as R from "ramda";

describe("lens proxy", () => {
    it("eject returns inner stateLens profunctor", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const stateLens = StateLens(initialModel, _ => { })
        const proxy = LensProxy(stateLens)

        // Act
        const innerStateLens = eject(proxy);

        // Assert
        expect(innerStateLens).toBe(stateLens)
    });

    it("get returns stateLens state", () => {
        // Arrange
        const state = { a: { b: "" } };
        const stateLens = StateLens(state, _ => { })
        const proxy = LensProxy(stateLens)

        // Act
        const value = get(proxy);

        // Assert
        expect(value).toBe(state)
    });

    it("set sets the stateLens state", () => {
        // Arrange
        let state = { a: { b: "" } };
        const otherModel = {};
        const setState = value => { state = value }
        const stateLensProxy = StateLens(state, setState) |> LensProxy

        // Act
        set(stateLensProxy)(otherModel);

        // Assert
        expect(otherModel).toBe(state)
    });

    it("set on property path containing nulls", () => {
        // Arrange
        let state = { a: null, b: undefined };
        const setState = setter => { state = setter(state) }
        const stateLensProxy = StateLens(state, setState) |> LensProxy

        // Act
        set(stateLensProxy.a.x)(1);
        set(stateLensProxy.b[0])(2);

        // Assert
        expect(state.a.x).toBe(1);
        expect(state.b[0]).toBe(2);
    });

    it("set works just like over", () => {
        // Arrange
        let state = { a: { b: "" } };
        const setState = setter => { state = setter(state) }
        const stateLensProxy = StateLens(state, setState) |> LensProxy
        const changeFn = x => x + "OK"

        // Act
        set(stateLensProxy.a.b)(changeFn);

        // Assert
        expect(state.a.b).toBe("OK")
    });

    it("over modifies the lens state", () => {
        // Arrange
        let state = { a: { b: "" } };
        const setState = setter => { state = setter(state) }
        const stateLensProxy = StateLens(state, setState) |> LensProxy
        const changeFn = x => x + "OK"

        // Act
        over(stateLensProxy.a.b)(changeFn);

        // Assert
        expect(state.a.b).toBe("OK")
    });


    it("inner field lens state setter", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const setState = jest.fn()
        const lens = new StateLens(initialModel, setState) |> LensProxy
        
        // Act
        set(lens.a.b, "OK");      

        // Assert
        expect(setState.mock.calls.length).toBe(1);
        const setter = setState.mock.calls[0][0]
        expect(setter(initialModel).a.b).toBe("OK");
    });

    it("inner lens equality", () => {
        // Arrange
        let model = { a: { b: "", c: "bau" } };
        const setState = setter => model = setter(model)
        const lens = new StateLens(model, setState) |> LensProxy

        // Act
        set(lens.a.b)("OK1"); 
        const before = set(lens.a.c)
        set(lens.a.b)("OK");      
        const after = set(lens.a.c)

        // Assert
        expect(before).toBe(after);
    });

    it("inner field lens state 3", () => {
        // Arrange
        let model = { a: { b: "" } };
        const setState = setter => model = setter(model)
        const lens = new StateLens(model, setState) |> LensProxy
        
        // Act
        set(lens.a.b, "OK");      

        // Assert
        expect(model.a.b).toBe("OK");
    });

    it("can be stringified", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const stateLensProxy = StateLens(initialModel, _ => { }) |> LensProxy
        
        // Act
        JSON.stringify(stateLensProxy);
        // Assert
    });

    it("promap proxy", () => {
        // Arrange
        let state = { a: { b: "" } }
        const setState = setter => { state = setter(state) }
        const otherModel = {};
        const stateLensProxy = StateLens(state, setState) |> LensProxy
        const proxy = stateLensProxy |> promap(
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
        const stateLensProxy = StateLens(state, setState) |> LensProxy
        
        const pipedProxy = pipe(stateLensProxy, R.lens(
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
        const stateLensProxy = StateLens(state, setState) |> LensProxy
        const innerLensProxy = stateLensProxy.a |> lmap(x => x || "")

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
        const stateLensProxy = StateLens(state, setState) |> LensProxy
        const innerLensProxy = stateLensProxy.a |> rmap(x => x || "other")

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
        const stateLens = StateLens(state, setState)
        const proxy = LensProxy(stateLens)

        // Act
        const proxies = proxy |> sequence
        const secondItemProxy = proxies[1]
        expect(secondItemProxy |> get).toBe(state[1])

        set(secondItemProxy, 22)

        // Assert
        expect(state).toEqual([1, 22, 3])
    });
})