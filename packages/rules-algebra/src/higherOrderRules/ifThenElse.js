import { curry } from "ramda";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";
import { ensureReader } from "../predicates";

export const ifThenElse = curry(function ifThenElse(predicate, ruleWhenTrue, ruleWhenFalse) {
    const predicateReader = ensureReader(predicate);
    checkRules(ruleWhenTrue, ruleWhenFalse);

    return $do(function* () {
        const isTrue = yield predicateReader;
        return isTrue ? yield ruleWhenTrue : yield ruleWhenFalse;
    });
});


export default ifThenElse
