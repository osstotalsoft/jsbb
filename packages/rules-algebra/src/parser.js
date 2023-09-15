// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import * as V from ".";
import { intersection } from "ramda"

function injectRulesAlgebraScope(scope) {
    const rulesAlgebraScope = { ...V, V }

    const conflicts = intersection(Object.keys(scope), Object.keys(rulesAlgebraScope))
    if (conflicts.length > 0) {
        throw new Error(`The following keywords are reserved: ${conflicts.join(", ")}`)
    }

    return { ...scope, ...rulesAlgebraScope }
}

export function parse(rule, { scope = {} } = {}) {
    const sanitizedRuleString = rule.trim()
    const augmentedScope = injectRulesAlgebraScope(scope)
    const assignScope = `const {${Object.keys(augmentedScope).join(", ")}} = $scope`

    const fn = Function('$scope', `'use strict';\n${assignScope};\nreturn ${sanitizedRuleString}`)
    
    return fn(augmentedScope)
}
