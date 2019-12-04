import { renderHook, act } from "@testing-library/react-hooks";
import { Rule, applyRule, logTo, __clearMocks } from "@totalsoft/pure-rules";
import { onChanged, getValue } from "../../rulesProfunctorProxy";
import { useRulesEngineProfunctor } from "../";
import * as di from "../../dirtyInfo"

describe("useValidation hook", () => {
    afterEach(() => {
        __clearMocks();
    });

    it("returns model with rule applied to it", () => {
        // Arrange
        const rule = Rule.of(1);
        const initialModel = { a: { b: "" } };
        const callback = () => {
            const [rootProf] = useRulesEngineProfunctor(rule, initialModel)

            return { rootProf, fieldProf: rootProf.a.b };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            onChanged(result.current.fieldProf)("OK");
        });

        // Assert
        const root = getValue(result.current.rootProf);
        const field = getValue(result.current.fieldProf);
        expect(applyRule.mock.calls.length).toBe(1);
        expect(field).toBe("OK");
        expect(root.a.b).toBe("OK");
        expect(root).not.toBe(initialModel);
        expect(root._ruleValue).toBe(1);
    });

    it("returns model with rule applied to it inside loop", () => {
        // Arrange
        const rule = Rule.of(1);
        const initialModel = { a: [1, 2, 3] };
        const callback = () => {
            const [rootProf] = useRulesEngineProfunctor(rule, initialModel)

            let array = getValue(rootProf.a)
            let fieldProfs = array.map((item, idx) => rootProf.a[idx]);

            return { rootProf, fieldProfs };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            onChanged(result.current.fieldProfs[0])("OK");
        });

        // Assert
        const root = getValue(result.current.rootProf);
        const field = getValue(result.current.fieldProfs[0]);
        expect(applyRule.mock.calls.length).toBe(1);
        expect(field).toBe("OK");
        expect(root.a[0]).toBe("OK");
        expect(root).not.toBe(initialModel);
        expect(root._ruleValue).toBe(1);
    });

    it("sets dirty info", () => {
        // Arrange
        const rule = Rule.of(1);
        const initialModel = { a: { b: "", c: "Initial" } };
        const callback = () => {
            const [rootProf, di] = useRulesEngineProfunctor(rule, initialModel)

            return { rootProf, fieldProf: rootProf.a.b, di };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            onChanged(result.current.fieldProf)("OK");
        });

        // Assert
        const dirtyInfo = result.current.di;
        expect(dirtyInfo).toStrictEqual(di.update("a.b", true, di.create()))
        
    });

    it("enforces reference and render economy if updated with same value", () => {
        // Arrange
        const rule = Rule.of(1);
        const initialModel = { a: { b: "" } };

        const callback = () => {
            const [rootProf] = useRulesEngineProfunctor(rule, initialModel)

            return { rootProf, fieldProf: rootProf.a.b };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            onChanged(result.current.fieldProf)("OK");
        });
        const model1 = result.current.rootProf;
        act(() => {
            onChanged(result.current.fieldProf)("OK");
        });
        const model2 = result.current.rootProf;
        // // Assert
        expect(applyRule.mock.calls.length).toBe(1);
        expect(model1).toBe(model2);
        expect(getValue(model1)._ruleValue).toBe(1);
    });


    it("returns initial model when rule is not run", () => {
        // Arrange
        const rule = Rule.of(1);
        const initialModel = { a: { b: "" } };

        // Act
        const { result } = renderHook(() => useRulesEngineProfunctor(rule, initialModel));


        // Assert
        const [model] = result.current;
        expect(getValue(model)).toBe(initialModel);

    });


    it("returns initial model after reset", () => {
        // Arrange
        const rule = Rule.of(1);
        const initialModel = { a: { b: "" } };

        const callback = () => {
            const [rootProf, , resetFunc] = useRulesEngineProfunctor(rule, initialModel)

            return { rootProf, fieldProf: rootProf.a.b, resetFunc };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            const { fieldProf } = result.current;
            onChanged(fieldProf, "OK")
        });
        const { rootProf: rootProf1 } = result.current;
        act(() => {
            const { resetFunc } = result.current;
            resetFunc(initialModel);
        });

        // Assert
        const { rootProf: rootProf2 } = result.current;
        expect(getValue(rootProf1)).not.toBe(initialModel);
        expect(getValue(rootProf2)).toBe(initialModel);
    });



    it("should minimize the number of renders", () => {
        // Arrange
        const rule = Rule.of(1);
        const initialModel = { a: { b: "" } };
        let renderNo = 0;
        function renderCallack() {
            renderNo = renderNo + 1;
            const [rootProf] = useRulesEngineProfunctor(rule, initialModel)
            return { rootProf, fieldProf: rootProf.a.b, };
        }

        // Act
        const { result, rerender } = renderHook(renderCallack);
        act(() => {
            const { fieldProf } = result.current;
            onChanged(fieldProf, "OK")
        });
        rerender();

        // Assert
        expect(renderNo).toBe(3);
    });

    it("calls the logTo HOV function once", () => {
        // Arrange
        const rule = Rule.of(1);
        const logger = { log: _ => { } };
        const initialModel = { a: { b: "" } };
        function renderCallack() {
            const [rootProf] = useRulesEngineProfunctor(rule, initialModel, { logger })
            return { rootProf, fieldProf: rootProf.a.b, };
        }
        // Act
        const { result } = renderHook(renderCallack);
        act(() => {
            const { fieldProf } = result.current;
            onChanged(fieldProf)("OK")
        });

        // Assert
        expect(logTo.mock.calls).toEqual([[logger]]);
    });

    it("does not change the returned object references on re-render", () => {
        // Arrange
        const rule = Rule.of(1);
        const initialModel = { a: { b: "" } };

        // Act
        const { result, rerender } = renderHook(() => useRulesEngineProfunctor(rule, initialModel));
        const [prof1, dirtyInfo1, reset1] = result.current;
        rerender();
        const [prof2, dirtyInfo2, reset2] = result.current;

        // Assert
        expect(prof1).toBe(prof2);
        expect(dirtyInfo1).toBe(dirtyInfo2);
        expect(reset1).toBe(reset2);
    });

    it("applies new rule when the rule changes", () => {
        // Arrange
        const initialModel = {}
        const logger = {}
        let ruleValue = Rule.of(1);

        // Act
        const { result, rerender } = renderHook(() => useRulesEngineProfunctor(ruleValue, initialModel, { logger }));
        const [prof1] = result.current;
        act(() => {
            onChanged(prof1, { value: "a" })
        });
        const [prof2] = result.current;
        ruleValue = Rule.of(2);
        rerender()
        const [prof3] = result.current;
        act(() => {
            onChanged(prof3, { value: "b" })
        });
        const [prof4] = result.current;

        // Assert
        const firstChange = getValue(prof2)
        const secondChange = getValue(prof4)
        expect(prof2).not.toBe(prof3)
        expect(applyRule.mock.calls.length).toBe(2);
        expect(firstChange).not.toBe(secondChange);
        expect(firstChange).toStrictEqual({ value: "a", _ruleValue: 1 })
        expect(secondChange).toStrictEqual({ value: "b", _ruleValue: 2 })
    });

    it("changes the profunctor when the rule changes", () => {
        // Arrange
        const initialModel = {}
        const logger = {}
        const callback = () => useRulesEngineProfunctor(Rule.of(1), initialModel, { logger });

        // Act
        const { result, rerender } = renderHook(callback);
        const [prof1, dirtyInfo1, reset1] = result.current;
        rerender();
        const [prof2, dirtyInfo2, reset2] = result.current;

        // Assert
        expect(prof1).not.toBe(prof2);
        expect(dirtyInfo1).toBe(dirtyInfo2);
        expect(reset1).toBe(reset2);
    });


    it("it doesn't change when when the initial model changes", () => {
        // Arrange
        const rule = Rule.of(1);
        const logger = {}
        const callback = () => useRulesEngineProfunctor(rule, {}, { logger });

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


    it("changes the profunctor when the logging flag changes", () => {
        // Arrange
        const initialModel = {}
        const rule = Rule.of(1);
        let isLogEnabled = true;
        const callback = () => {
            isLogEnabled = !isLogEnabled;
            return useRulesEngineProfunctor(rule, initialModel, { isLogEnabled: !isLogEnabled });
        }

        // Act
        const { result, rerender } = renderHook(callback);
        const [prof1, dirtyInfo1, reset1] = result.current;
        rerender();
        const [prof2, dirtyInfo2, reset2] = result.current;

        // Assert
        expect(prof1).not.toBe(prof2);
        expect(dirtyInfo1).toBe(dirtyInfo2);
        expect(reset1).toBe(reset2);
    });


    it("changes the profunctor  when  other deps change", () => {
        // Arrange
        const initialModel = {}
        const rule = Rule.of(1);
        let depFlag = true;
        const callback = () => {
            depFlag = !depFlag;
            return useRulesEngineProfunctor(rule, initialModel, {}, [depFlag]);
        }

        // Act
        const { result, rerender } = renderHook(callback);
        const [prof1, dirtyInfo1, reset1] = result.current;
        rerender();
        const [prof2, dirtyInfo2, reset2] = result.current;

        // Assert
        expect(prof1).not.toBe(prof2);
        expect(dirtyInfo1).toBe(dirtyInfo2);
        expect(reset1).toBe(reset2);
    });
});
