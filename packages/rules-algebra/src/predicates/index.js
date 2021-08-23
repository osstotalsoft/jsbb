// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Rule } from "../rule";
import * as fl from "fantasy-land";
import { curry, map, lift, reduce } from "ramda";
import { $do } from "@totalsoft/zion";
import { checkRules, variadicApply } from "../_utils";

export const Predicate = Rule;
Predicate.of = Rule[fl.of]

export const propertyChanged = curry(function propertyChanged(selector) {
    return $do(function* () {
        const [, ctx] = yield Rule.ask();

        if (ctx.document === null || ctx.document === undefined || ctx.prevDocument === null || ctx.prevDocument === undefined) {
            return ctx.document !== ctx.prevDocument;
        }

        return selector(ctx.document) !== selector(ctx.prevDocument)
    });
});

export const propertiesChanged = curry(function propertyChanged(selector) {
    return $do(function* () {       
        const [, ctx] = yield Rule.ask();

        if (ctx.document === null || ctx.document === undefined || ctx.prevDocument === null || ctx.prevDocument === undefined) {
            return ctx.document !== ctx.prevDocument;
        }

        const properties = selector(ctx.document);
        const prevProperties = selector(ctx.prevDocument);

        return properties.some((value, index) => value !== prevProperties[index])
    });
});

//export const equals = lift(x => y => x === y) |> ensurePredicateParams

export const equals = curry(function equals(selector1, selector2) {
    return $do(function* () {
        const [, ctx] = yield Rule.ask();
        return selector1(ctx.document) === selector2(ctx.document)
    });
});

const _and = lift(x => y => x && y);
export const all = variadicApply(function all(...predicates) {
    return predicates |> map(ensurePredicate) |> reduce(_and, Predicate.of(true));
});

const _or = lift(x => y => x || y);
export const any = variadicApply(function any(...predicates) {
    return predicates |> map(ensurePredicate) |> reduce(_or, Predicate.of(false));
});

export function not(predicate) {
    return predicate |> ensurePredicate |> map(x => !x)
}

export function isNumber(selector) {
    return selector |> ensurePredicate |> map(x => !isNaN(x))
}

function computed(computation) {
    return Predicate((prop, { document, prevDocument }) => computation(document, prevDocument, prop));
}

export function ensurePredicate(predicate) {
    if (typeof predicate === "boolean") {
        return Predicate.of(predicate);
    }
    if (typeof predicate === "function") {
        return computed(predicate);
    }

    checkRules(predicate);

    return predicate;
}