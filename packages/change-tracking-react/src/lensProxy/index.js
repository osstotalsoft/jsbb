import { ProfunctorState } from "@staltz/use-profunctor-state";
import { curry } from "ramda";

const setValueSymbol = Symbol("setValue")
const getValueSymbol = Symbol("getValue")
const targetSymbol = Symbol("target")
const cachedPropPrefix = "__@@";
const ignoredPrefixes = ["@@", "$$"];

const handler = {
    get: function (target, name) {
        switch (name) {
            case "state":
            case "setState":
            case "promap": {
                return target[name]
            }
            case targetSymbol: {
                return target
            }
            case getValueSymbol: {
                return target.state;
            }
            case setValueSymbol: {
                return target.setState;
            }
            default: {
                if (isIgnoredProp(name)) {
                    return target[name];
                }

                const cachedPropName = `${cachedPropPrefix}${name}`
                if (cachedPropName in target) {
                    return target[cachedPropName]
                }

                const proxy = LensProxy(getFieldScope(target, name))
                target[cachedPropName] = proxy; // cache value
                return proxy
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
    if (obj[prop] === value) {
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
export function setValue(proxy, newValue = undefined) {
    if (newValue !== undefined) {
        return proxy[setValueSymbol](newValue)
    } else {
        return proxy[setValueSymbol]
    }
}

export function getValue(proxy) {
    return proxy[getValueSymbol]
}

export const overValue = curry(function overValue(proxy, func) {
    let value = getValue(proxy);
    return setValue(proxy, func(value))
})

export function LensProxy(ruleEngineProfunctor) {
    return new Proxy(ruleEngineProfunctor, handler)
}