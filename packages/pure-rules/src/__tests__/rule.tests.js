import { Rule, applyRule } from "../";
import { fromModel, when, shape } from "../higherOrderRules";
import { constant } from "../primitiveRules";
import { propertyChanged, not } from "../predicates";

describe("rules tests suite:", () => {
    it("rules test: ", () => {
        // Arrange
        const rule = shape({
            //a: Rule((_prop, { newDocument }) => newDocument.b + 1),
            a: Rule(doc => doc.b + 1),
            c: constant(null) |> when(not(propertyChanged(doc => doc.b))),
            d: Rule(doc => doc.a + doc.b),
            child: fromModel(child => shape({
                bb: constant(child.aa + 3) |> when(propertyChanged(doc => doc.child.aa))
            }))
        })

        
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
            const currentResult = applyRule(rule, result, prevResult, { logger: console, log: true })
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
