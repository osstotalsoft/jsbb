// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { curry } from "ramda";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";
import { ensurePredicate } from "../predicates";

export const ifThenElse = curry(function ifThenElse(predicate, ruleWhenTrue, ruleWhenFalse) {
    const predicateReader = ensurePredicate(predicate);
    checkRules(ruleWhenTrue, ruleWhenFalse);

    return $do(function* () {
        const isTrue = yield predicateReader;
        return isTrue ? yield ruleWhenTrue : yield ruleWhenFalse;
    });
});


export default ifThenElse
