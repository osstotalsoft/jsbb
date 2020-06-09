import { curry } from "ramda";
import * as L from "../lensState"

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

export const promap = curry(function promap(get, set, proxy) {
    return proxy |> _mapProxy(L.promap(get, set))
})

export const lmap = curry(function lmap(get, proxy) {
    return proxy |> _mapProxy(L.lmap(get))
})

export const rmap = curry(function rmap(set, proxy) {
    return proxy |> _mapProxy(L.rmap(set))
})

export function sequence(proxy) {
    return proxy |> _seqProxy(L.sequence)
}

export const compose = curry(function (otherLens, proxy) {
    return proxy |> _mapProxy(L.compose(otherLens))
})

const _mapProxy = curry(function (lensFunc, proxy) {
    const lens = eject(proxy)
    const newLens = lensFunc(lens)
    return (newLens === lens) ? proxy : LensProxy(newLens)
})

const _seqProxy = curry(function (lensFunc, proxy) {
    const lens = eject(proxy)
    const newLenses = lensFunc(lens)
    return newLenses.map(LensProxy)
})

export function LensProxy(profunctor) {
    return new Proxy(profunctor, handler)
}