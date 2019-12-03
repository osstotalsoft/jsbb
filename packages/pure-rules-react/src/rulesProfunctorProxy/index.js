import { ProfunctorState } from "@staltz/use-profunctor-state";

const onChangedSymbol = Symbol("onChanged")
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
            case onChangedSymbol: {
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

                const proxy = RulesEngineProxy(getFieldScope(target, name))
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
    // return profunctor.promap(
    //     model => model[fieldName],
    //     (fieldValue, model) => _immutableAssign(model, fieldName, fieldValue),
    //     [false]
    // )

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

export function onChanged(proxy, newValue = undefined) {
    if (newValue !== undefined) {
        return proxy[onChangedSymbol](newValue)
    } else {
        return proxy[onChangedSymbol]
    }
}

export function getValue(proxy) {
    return proxy[getValueSymbol]
}

export function RulesEngineProxy(ruleEngineProfunctor) {
    return new Proxy(ruleEngineProfunctor, handler)
}