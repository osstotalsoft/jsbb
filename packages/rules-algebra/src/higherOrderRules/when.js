// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { curry } from "ramda";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";
import { unchanged } from "../primitiveRules"
import { ensureReader } from "../predicates";

export const when = curry(function when(predicate, rule) {
    const predicateReader = ensureReader(predicate);
    checkRules(rule);

    return $do(function* () {
        const isTrue = yield predicateReader;
        return isTrue ? yield rule : yield unchanged;
    });
});


export default when
