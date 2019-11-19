import { Rule } from "../rule";
import { lift, curry, curryN } from "ramda"
import Reader from "@totalsoft/zion/data/reader";

const ensureReaderParams = curry(function (N, func) {
    return curryN(N, function (...args) {
        const readerArgs = args.map(ensureReader);
        return func(...readerArgs)
    })
})

export const unchanged = Rule(model => model);

export function constant(value) {
    return Rule.of(value);
}

export function computed(computation) {
    return Rule((prop, { document, prevDocument }) => computation(document, prevDocument, prop));
}

export const min = lift(curry(Math.min)) |> ensureReaderParams(2);
export const max = lift(curry(Math.max)) |> ensureReaderParams(2);
export const sum = lift(curry((a, b) => a + b)) |> ensureReaderParams(2);


export const minimumValue = max(unchanged) |> ensureReaderParams(1)
export const maximumValue = min(unchanged) |> ensureReaderParams(1)


function ensureReader(selector) {
    if (Reader.is(selector)) {
        return selector;
    }
    if (typeof selector === "function") {
        return computed(selector);
    }

    return constant(selector);
}
