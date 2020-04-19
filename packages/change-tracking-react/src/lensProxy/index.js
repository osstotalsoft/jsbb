import { ProfunctorState } from "@staltz/use-profunctor-state";
import { curry } from "ramda";

const targetSymbol = Symbol("target")
const cacheSymbol = Symbol("cache")
const ignoredPrefixes = ["@@", "$$"];

const handler = {
    ownKeys(_target) {
        return [];
    },
    get: function (target, prop) {
        switch (prop) {
            case targetSymbol: {
                return target;
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
                const propLens = getFieldScope(target, prop);
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

function _immutableAssign(obj, prop, value) {
    if (obj == null || obj == undefined) {
        if (Number.isInteger(Number(prop))) {
            obj = [];
        }
        else {
            obj = {};
        }
    }
    else if (obj[prop] === value) {
        return obj;
    }

    return Array.isArray(obj)
        ? Object.assign([...obj], { [prop]: value })
        : { ...obj, [prop]: value }
}

function getFieldScope(profunctor, fieldName) {
    return promapWithoutMemo(profunctor)(
        model => model && model[fieldName],
        (fieldValue, model) => _immutableAssign(model, fieldName, fieldValue)
    )
}

// HACK: the default promap calls useMemo hook that is not valid in all contexts.
// For memoization we use custom logic in th proxy (see above)
function promapWithoutMemo(profunctor) {
    return function (get, set) {
        const innerSetState = newInnerStateOrUpdate => {
            profunctor.setState(prevState => {
                const innerState = get(prevState);
                const newInnerState =
                    typeof newInnerStateOrUpdate === 'function'
                        ? (newInnerStateOrUpdate)(innerState)
                        : (newInnerStateOrUpdate);
                if (newInnerState === innerState) return prevState;
                return set(newInnerState, prevState);
            });
        };

        const innerState = get(profunctor.state);
        const newProfunctor = new ProfunctorState(innerState, innerSetState);
        newProfunctor.promap = promapWithoutMemo(newProfunctor);
        return newProfunctor;
    }
}

export function eject(proxy) {
    return proxy[targetSymbol]
}

// Manual curry workaround
export function set(proxy, newValue = undefined) {
    if (newValue !== undefined) {
        return eject(proxy).setState(newValue)
    } else {
        return eject(proxy).setState
    }
}

export function get(proxy) {
    return eject(proxy).state
}

export const over = curry(function over(proxy, func) {
    let value = get(proxy);
    return set(proxy, func(value))
})

export const promap = curry(function promap(get, set, proxy) {
    const lens = eject(proxy);
    const newLens = promapWithoutMemo(lens)(get, set);
    return LensProxy(newLens)
})

export const lmap = curry(function lmap(get, proxy) {
    const lens = eject(proxy);
    const newLens = promapWithoutMemo(lens)(get, x => x);
    return LensProxy(newLens)
})

export const rmap = curry(function rmap(set, proxy) {
    const lens = eject(proxy);
    const newLens = promapWithoutMemo(lens)(x => x, set);
    return LensProxy(newLens)
})

export function sequence(proxy) {
    const xs = (proxy |> get) || []
    if (!Array.isArray(xs)) {
        throw new Error(`Cannot sequence lens with value ${xs.toString()}`);
    }
    const result = xs.map((_, index) => proxy[index])
    return result
}

export function LensProxy(profunctor) {
    return new Proxy(profunctor, handler)
}