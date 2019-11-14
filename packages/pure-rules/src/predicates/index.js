import Reader from "@totalsoft/zion/data/reader";
import { curry, map } from "ramda";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";

export const propertyChanged = curry(function propertyChanged(selector) {
    return $do(function* () {
        const [, ctx] = yield Reader.ask();
        return selector(ctx.newDocument) !== selector(ctx.oldDocument)
    });
});


export function not(predicate) {
    const predicateReader = ensureReader(predicate);
    return predicateReader |> map(x => !x)
}

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