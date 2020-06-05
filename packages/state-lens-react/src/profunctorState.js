import { tagged } from "daggy";
import * as fl from "fantasy-land";
import { identity } from "ramda"

const ProfunctorState = tagged("ProfunctorState", ["state", "setState"]);

/* Profunctor ProfunctorState */ {
    ProfunctorState.prototype[fl.promap] = function (get, set) {
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
        return ProfunctorState(innerState, innerSetState)
    }
}

/* Functor ProfunctorState */ {
    ProfunctorState.prototype[fl.map] = function (f) {
        return this[fl.promap](identity, f)
    }
}

export default ProfunctorState;
