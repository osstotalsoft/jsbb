import Reader from "@totalsoft/zion/data/reader";
import { curry } from "ramda";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";
import { unchanged } from "../primitiveRules"

export const when = curry(function when(predicate, rule) {
    const predicateReader = ensureReader(predicate);
    checkRules(rule);

    return $do(function* () {
        const isTrue = yield predicateReader;
        return isTrue ? yield rule : yield unchanged;
    });
});

function ensureReader(predicate) {
    if (typeof predicate === "boolean") {
        return Reader.of(predicate);
    }
    if (typeof predicate === "function") {
        return Reader(predicate);
    }

    checkRules(predicate);

    return predicate;
}

export default when
