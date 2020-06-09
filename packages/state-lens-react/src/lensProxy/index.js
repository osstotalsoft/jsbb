import { curry } from "ramda";
import * as L from "../lensState"
import * as fl from "fantasy-land";
import * as Z from "@totalsoft/zion"

const cacheSymbol = Symbol("cache")
const ignoredPrefixes = ["@@", "$$"]

const handler = {
    ownKeys(_target) {
        return ["__target"];
    },
    getOwnPropertyDescriptor(target, prop) {
        if (prop === "__target") {
            return { configurable: true, enumerable: true };
        }
    },
    get: function (target, prop) {
        switch (prop) {
            case "__target": {
                return target;
            }
            case "toJSON": {
                return function () { return target; }
            }
            case fl.promap: {
                return function (get, set) { return target[fl.promap](get, set) |> LensProxy }
            }
            case fl.map: {
                return function (func) { return target[fl.map](func) |> LensProxy }
            }
            default: {
                if (isIgnoredProp(prop)) {
                    return target[prop];
                }
                if (!target[cacheSymbol]) {
                    target[cacheSymbol] = {};
                }
                if (prop in target[cacheSymbol]) {
                    return target[cacheSymbol][prop];
                }
                const propLens = L.getInnerLens(target, prop);
                const proxy = LensProxy(propLens);

                target[cacheSymbol][prop] = proxy; // cache value
                return proxy;
            }
        }
    }
}

function isIgnoredProp(name) {
    if (typeof name === "string" && ignoredPrefixes.some(prefix => name.startsWith(prefix))) {
        return true;
    }
    if (typeof name === "symbol") {
        return true;
    }

    return false;
}

export function eject(proxy) {
    return proxy["__target"]
}

// Manual curry workaround
export function set(proxy, newValue = undefined) {
    return L.set(eject(proxy), newValue)
}

export function get(proxy) {
    return L.get(eject(proxy))
}

export const over = curry(function over(proxy, func) {
    return L.over(eject(proxy), func)
})

export const promap = Z.promap;

export const lmap = Z.lmap;

export const rmap = Z.rmap;

export function sequence(proxy) {
    const lens = eject(proxy)
    const newLenses = L.sequence(lens)
    return newLenses.map(LensProxy)
}

export const pipe = curry(function (proxy, otherLens) {
    const lens = eject(proxy)
    const newLens = L.pipe(lens, otherLens)
    return (newLens === lens) ? proxy : LensProxy(newLens)
})

export function LensProxy(stateLens) {
    return new Proxy(stateLens, handler)
}