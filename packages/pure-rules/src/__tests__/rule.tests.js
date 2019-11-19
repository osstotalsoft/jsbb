import { applyRule } from "../";
import { when, shape, chainRules, logTo, scope } from "../higherOrderRules";
import { constant, computed, maximumValue } from "../primitiveRules";
import { propertyChanged, not } from "../predicates";

describe("rules tests suite:", () => {
    it("rules test: ", () => {
        // Arrange
        const rule = shape({
            //a: Rule((_prop, { document }) => document.b + 1),
            a: [computed(doc => doc.b + 1), maximumValue(50)] |> chainRules,
            c: constant(null) |> when(not(propertyChanged(doc => doc.b))),
            d: computed(doc => doc.a + doc.b),
            child: scope(doc => doc.child, shape({
                bb: computed(child => child.aa + 3) |> when(propertyChanged(child => child.aa)),
                //cc: computed((doc) => doc.child.bb) |> when(propertyChanged(doc => doc.child.bb))
            }))
        }) |> logTo(console)


        const oldModel = {
            a: 1,
            b: 2,
            c: 3,
            child: {
                aa: 11,
                bb: 22
            }
        }

        const newModel = {
            a: 1,
            b: 99,
            c: 3,
            child: {
                aa: 111,
                bb: 22
            }
        }

        // Act
        let prevResult = oldModel;
        let result = newModel;
        while (result !== prevResult) {
            console.log("----RUN ----");
            const currentResult = applyRule(rule, result, prevResult)
            prevResult = result;
            result = currentResult;
        }

        // const result = applyRule(rule, newModel, oldModel, { logger: console, log: true })
        // const result2 = applyRule(rule, result, newModel, { logger: console, log: true })
        // const result3 = applyRule(rule, result2, result, { logger: console, log: true })

        // Assert
        //    ;
    });
});
