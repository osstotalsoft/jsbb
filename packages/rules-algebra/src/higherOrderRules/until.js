// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { curry } from "ramda";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";
import { unchanged } from "../primitiveRules"
import { ensurePredicate } from "../predicates";
import { chainRules } from "./";

export const until = curry(function until(predicate, rule) {
    const predicateReader = ensurePredicate(predicate);
    checkRules(rule);

    return $do(function* () {
        const isTrue = yield predicateReader;
        return isTrue ? yield unchanged: yield chainRules(rule, until(predicate, rule));
    });
});


export default until
