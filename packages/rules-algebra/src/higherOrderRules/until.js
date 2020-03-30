import { curry } from "ramda";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";
import { unchanged } from "../primitiveRules"
import { ensureReader } from "../predicates";
import { chainRules } from "./";

export const until = curry(function until(predicate, rule) {
    const predicateReader = ensureReader(predicate);
    checkRules(rule);

    return $do(function* () {
        const isTrue = yield predicateReader;
        return isTrue ? yield unchanged: yield chainRules(rule, until(predicate, rule));
    });
});


export default until
