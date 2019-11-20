import Reader from "@totalsoft/zion/data/reader";
import fl from "fantasy-land";
import { curry, map, lift, reduce } from "ramda";
import { $do } from "@totalsoft/zion";
import { checkRules, variadicApply } from "../_utils";

export const Predicate = Reader;
Predicate.of = Reader[fl.of]

export const propertyChanged = curry(function propertyChanged(selector) {
    return $do(function* () {
        const [, ctx] = yield Reader.ask();
        return selector(ctx.document) !== selector(ctx.prevDocument)
    });
});

export const propertiesChanged = curry(function propertyChanged(selector) {
    return $do(function* () {
        const [, ctx] = yield Reader.ask();
        const properties = selector(ctx.document);
        const prevProperties = selector(ctx.prevDocument);

        return properties.some((value, index) => value !== prevProperties[index])
    });
});

//export const equals = lift(x => y => x === y) |> ensureReaderParams

export const equals = curry(function equals(selector1, selector2) {
    return $do(function* () {
        const [, ctx] = yield Reader.ask();
        return selector1(ctx.document) === selector2(ctx.document)
    });
});

const _and = lift(x => y => x && y);
export const all = variadicApply(function all(...predicates) {
    return predicates |> map(ensureReader) |> reduce(_and, Predicate.of(true));
});

const _or = lift(x => y => x || y);
export const any = variadicApply(function any(...predicates) {
    //const test =  predicates |> map(ensureReader) |> reduce(_or);
    return predicates |> map(ensureReader) |> reduce(_or, Predicate.of(false));
});

export function not(predicate) {
    return predicate |> ensureReader |> map(x => !x)
}

export function isNumber(selector) {
    return selector |> ensureReader |> map(x => !isNaN(x))
}

export function ensureReader(predicate) {
    if (typeof predicate === "boolean") {
        return Predicate.of(predicate);
    }
    if (typeof predicate === "function") {
        return Predicate(predicate);
    }

    checkRules(predicate);

    return predicate;
}