import Reader from "@totalsoft/zion/data/reader";
import { curry, map } from "ramda";
import { $do, contramap } from "@totalsoft/zion";
import { checkRules } from "../_utils";

export const propertyChanged = curry(function propertyChanged(selector) {
    return $do(function* () {
        const [, ctx] = yield Reader.ask();
        return selector(ctx.document) !== selector(ctx.prevDocument)
    });
});


export function not(predicate) {
    const predicateReader = ensureReader(predicate);
    return predicateReader |> map(x => !x)
}

export default function ofParent(predicate) {
    const predicateReader = ensureReader(predicate);
    return predicateReader |> contramap((_, ctx) => [ctx.parentModel, ctx.parentContext]);
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