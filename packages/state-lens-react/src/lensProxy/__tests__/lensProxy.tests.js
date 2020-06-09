import { LensProxy, eject, get, set, over, promap, lmap, rmap, sequence, compose } from "..";
import ProfunctorState from "../../profunctorState";
import * as R from "ramda";

describe("lens proxy", () => {
    it("eject returns inner profunctopr", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const profunctor = ProfunctorState(initialModel, _ => { });
        const proxy = LensProxy(profunctor)

        // Act
        const innerProfunctor = eject(proxy);

        // Assert
        expect(innerProfunctor).toBe(profunctor)
    });

    it("get returns profunctor state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const profunctor = ProfunctorState(initialModel, _ => { })
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
        const prof = ProfunctorState(initialModel, newValue => { prof.state = newValue })
        const lensProxy = LensProxy(prof);

        // Act
        set(lensProxy)(otherModel);

        // Assert
        expect(otherModel).toBe(prof.state)
    });

    it("set on property path containing nulls", () => {
        // Arrange
        const initialModel = { a: null, b: undefined };
        const prof = ProfunctorState(initialModel, setter => { prof.state = setter(prof.state) })
        const lensProxy = LensProxy(prof)

        // Act
        set(lensProxy.a.x)(1);
        set(lensProxy.b[0])(2);

        // Assert
        expect(prof.state.a.x).toBe(1);
        expect(prof.state.b[0]).toBe(2);
    });

    it("set works just like over", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const prof = ProfunctorState(initialModel, setter => { prof.state = setter(prof.state) })
        const lensProxy = LensProxy(prof)
        const changeFn = x => x + "OK"

        // Act
        set(lensProxy.a.b)(changeFn);

        // Assert
        expect(prof.state.a.b).toBe("OK")
    });

    it("over modifies the profunctor state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const prof = ProfunctorState(initialModel, setter => { prof.state = setter(prof.state) })
        const lensProxy = LensProxy(prof)
        const changeFn = x => x + "OK"

        // Act
        over(lensProxy.a.b)(changeFn);

        // Assert
        expect(prof.state.a.b).toBe("OK")
    });

    it("inner field profunctor state", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        let prof = undefined
        let lens = undefined
        let setState = (setter) => {
            prof = new ProfunctorState(setter(prof.state), setState)
            lens = LensProxy(prof)
        }
        prof = new ProfunctorState(initialModel, setState)
        lens = LensProxy(prof)

        // Act
        set(lens.a.b, "OK");

        // Assert
        expect(get(lens.a.b)).toBe("OK");
    });

    it("can be stringified", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const prof = ProfunctorState(initialModel, _ => { })
        const lensProxy = LensProxy(prof)

        // Act
        JSON.stringify(lensProxy);
        // Assert
    });

    it("promap proxy", () => {
        // Arrange
        const initialModel = { a: { b: "" } }
        const otherModel = {};
        const prof = ProfunctorState(initialModel, setter => { prof.state = setter(prof.state) })
        const proxy = LensProxy(prof) |> promap(
            x => x.a,
            (fieldValue, model) => ({ ...model, a: fieldValue })
        )

        // Assert
        const value = proxy |> get
        expect(value).toBe(initialModel.a)

        // Act
        set(proxy, otherModel)

        // Assert
        expect(prof.state.a).toBe(otherModel)
    });

    it("compose ramda", () => {
        // Arrange
        const initialModel = { a: { b: "" } }
        const otherModel = {};
        const prof = ProfunctorState(initialModel, setter => { prof.state = setter(prof.state) })
        const proxy = LensProxy(prof) |> compose(R.lens(
            R.prop("a"),
            R.assoc("a")
        ))

        // Assert
        const value = proxy |> get
        expect(value).toBe(initialModel.a)

        // Act
        set(proxy, otherModel)

        // Assert
        expect(prof.state.a).toBe(otherModel)
    });

    it("lmap proxy", () => {
        // Arrange
        const initialModel = { a: null }
        const prof = ProfunctorState(initialModel, setter => { prof.state = setter(prof.state) })
        const proxy = LensProxy(prof).a |> lmap(x => x || "")

        // Assert
        const value = proxy |> get
        expect(value).toBe("")

        // Act
        set(proxy, 1)

        // Assert
        expect(prof.state.a).toBe(1)
    });

    it("rmap proxy", () => {
        // Arrange
        const initialModel = { a: "some" }
        const prof = ProfunctorState(initialModel, setter => { prof.state = setter(prof.state) })
        const proxy = LensProxy(prof).a |> rmap(x => x || "other")

        // Assert
        const value = proxy |> get
        expect(value).toBe("some")

        // Act
        set(proxy, null)

        // Assert
        expect(prof.state.a).toBe("other")
    });

    it("sequence proxy of array", () => {
        // Arrange
        const initialModel = [1, 2, 3]

        const prof = ProfunctorState(initialModel, setter => { prof.state = setter(prof.state) })
        const proxy = LensProxy(prof)

        // Act
        const proxies = proxy |> sequence
        const secondItemProxy = proxies[1]
        expect(secondItemProxy |> get).toBe(initialModel[1])

        set(secondItemProxy, 22)


        // Assert
        expect(prof.state).toEqual([1, 22, 3])
    });
})