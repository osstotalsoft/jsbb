import { applyRule } from "../";
import { } from "../higherOrderRules"; // import { when, shape, logTo, scope, chainRules, items, root, parent, fromModel } from "../higherOrderRules";
import { unchanged } from "../primitiveRules"; // import { constant, computed, maximumValue, unchanged } from "../primitiveRules";
import { } from "../predicates" // import { propertyChanged, any, all, propertiesChanged } from "../predicates";

import { ensureArrayUIDsDeep } from "../arrayUtils";


describe("workshop examples:", () => {
    it("workshop example: ", () => {
        // Arrange
        const rule = unchanged

        const originalLoan = {
            aquisitionPrice: 100,
            interestRate: 0.05,
            advance: 10,
            approved: true,
            persons: [
                { name: "Doe", surname: "John" }, 
                { name: "Klaus", surname: "John"}
            ]
        } |> ensureArrayUIDsDeep

        const changedLoan = { 
            ...originalLoan, 
            advance: 20, 
            isCompanyLoan: false,
            persons: [
                { ...originalLoan.persons[0], name: "Smith" },
                { ...originalLoan.persons[1], surname: "Santa" },
            ] 
        }

        // Act
        const result = applyRule(rule, changedLoan, originalLoan)

        // Assert
        expect(result).toStrictEqual({ 
            ...changedLoan, 
            // advancePercent: 20, 
            // approved: false, 
            // persons: [
            //     { ...changedLoan.persons[0], fullName: "John Smith"}, //, isCompanyRep: false },
            //     { ...changedLoan.persons[1], fullName: "Santa Klaus"} //, isCompanyRep: false }
            // ]
        })
    });
});
