import { applyRule } from "../";
import { when, shape, logTo, scope, chainRules } from "../higherOrderRules";
import { constant, computed, maximumValue } from "../primitiveRules";
import { propertyChanged, any, propertiesChanged } from "../predicates";

describe("composed rules:", () => {
    it("readme rules: ", () => {
        // Arrange
        const console = { log: () => { } };
        const rule = shape({
            advance: maximumValue(loan => loan.aquisitionPrice),
            advancePercent: [computed(loan => loan.advance * 100 / loan.aquisitionPrice), maximumValue(100)] |> chainRules,
            approved: constant(false) |> when(
                [
                    propertyChanged(loan => loan.advance),
                    propertyChanged(loan => loan.interestRate)
                ] |> any),
            person: scope(loan => loan.person, shape({
                fullName: computed(person => `${person.surname} ${person.name}`) |> when(propertiesChanged(person => [person.name, person.surname])),
            }))
        }) |> logTo(console)


        const originalModel = {
            aquisitionPrice: 100,
            interestRate: 0.05,
            advance: 10,
            approved: true,
            person: {
                name: "Doe",
                surname: "John"
            }
        }

        const changedModel = { ...originalModel, advance: 20, person: { ...originalModel.person, name: "Smith" } }

        // Act
        const result = applyRule(rule, changedModel, originalModel)

        // Assert
        expect(result).toStrictEqual({ ...changedModel, advancePercent: 20, approved: false, person: { ...changedModel.person, fullName: "John Smith" } })
    });

    it("shape and circular propertyChanged rules - one field changed: ", () => {
        // Arrange
        const rule = shape({
            a: computed(doc => doc.b) |> when(propertyChanged(doc => doc.b)),
            b: computed(doc => doc.a) |> when(propertyChanged(doc => doc.a))
        })

        const originalModel = { a: 1, b: 1 }

        const changedModel1 = { ...originalModel, a: 2 }
        const changedModel2 = { ...originalModel, b: 2 }

        // Act
        const result1 = applyRule(rule, changedModel1, originalModel)
        const result2 = applyRule(rule, changedModel2, originalModel)

        // Assert
        expect(result1).toStrictEqual({ a: 2, b: 2 })
        expect(result2).toStrictEqual({ a: 2, b: 2 })
    });

    it("shape and circular propertyChanged rules - no field changed: ", () => {
        // Arrange
        const rule = shape({
            a: computed(doc => doc.b) |> when(propertyChanged(doc => doc.b)),
            b: computed(doc => doc.a) |> when(propertyChanged(doc => doc.a))
        })

        const originalModel = { a: 1, b: 2 }

        const changedModel = { ...originalModel }

        // Act
        const result = applyRule(rule, changedModel, originalModel)

        // Assert
        expect(result).toStrictEqual({ a: 1, b: 2 })
    });

    it("shape and circular propertyChanged rules - both fields changed: ", () => {
        // Arrange
        const rule = shape({
            a: computed(doc => doc.b) |> when(propertyChanged(doc => doc.b)),
            b: computed(doc => doc.a) |> when(propertyChanged(doc => doc.a))
        })

        const originalModel = { a: 1, b: 1 }
        const changedModel = { ...originalModel, a: 2, b: 3 }

        // Act
        const result = applyRule(rule, changedModel, originalModel)

        // Assert
        expect(result).toStrictEqual({ a: 3, b: 2 })
    });

    it("shape and circular propertyChanged cascade changes: ", () => {
        // Arrange
        const rule = shape({
            a: computed(doc => doc.a + 1),
            b: computed(doc => doc.a) |> when(propertyChanged(doc => doc.a))
        })

        const originalModel = { a: 1, b: 0, }
        const changedModel = { ...originalModel }

        // Act
        const result = applyRule(rule, changedModel, originalModel)
        const result2 = applyRule(rule, result, changedModel)

        // Assert
        expect(result).toStrictEqual({ a: 2, b: 0 })
        expect(result2).toStrictEqual({ a: 3, b: 2 })
    });

});
