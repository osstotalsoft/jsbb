import { tagged } from "daggy";
import * as fl from "fantasy-land";
import * as R from "ramda";
import * as Z from "@totalsoft/zion"
import { identity } from "ramda"

export const StateLens = tagged("StateLens", ["state", "setState"]);

/* Profunctor StateLens */ {
    StateLens.prototype[fl.promap] = function (get, set) {
        const setState = this.setState;
        const innerSetState = function (newInnerStateOrUpdate) {
            setState(prevState => {
                const innerState = get(prevState)
                const newInnerState =
                    typeof newInnerStateOrUpdate === 'function'
                        ? newInnerStateOrUpdate(innerState)
                        : newInnerStateOrUpdate

                if (newInnerState == innerState) {
                    return prevState
                }

                return set(newInnerState, prevState)
            })
        }

        const innerState = get(this.state)
        return StateLens(innerState, innerSetState)
    }
}

/* Functor StateLens */ {
    StateLens.prototype[fl.map] = function (f) {
        return this[fl.promap](identity, f)
    }
}

// Manual curry workaround
export function set(stateLens, newValue = undefined) {
    if (newValue !== undefined) {
        return stateLens.setState(newValue)
    } else {
        return stateLens.setState
    }
}

export function get(stateLens) {
    return stateLens.state
}

export const over = R.curry(function over(proxy, func) {
    let value = get(proxy);
    return set(proxy, func(value))
})

export const promap = Z.promap;

export const lmap = Z.lmap;

export const rmap = Z.rmap;

export const pipe = R.curry(function pipe(stateLens, otherLens) {
    if (typeof (otherLens) !== 'function') {
        throw Error("Parameter 'otherLens' is not a Ramda lens")
    }

    return stateLens |> Z.promap(R.view(otherLens), R.set(otherLens));
})

export function sequence(stateLens) {
    const xs = (stateLens |> get) || []
    if (!Array.isArray(xs)) {
        throw new Error(`Cannot sequence lens with value ${xs.toString()}`);
    }
    const result = xs.map((_, index) => getInnerLens(stateLens, index))
    return result
}

export function getInnerLens(stateLens, fieldName) {
    return stateLens |> Z.promap(
        model => model && model[fieldName],
        (fieldValue, model) => _immutableAssign(model, fieldName, fieldValue)
    )
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

export default StateLens
