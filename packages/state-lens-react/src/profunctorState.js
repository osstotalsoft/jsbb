import { tagged } from "daggy";
import * as fl from "fantasy-land";

const ProfunctorState = tagged("ProfunctorState", ["state", "setState"]);
/* Reader */ {
    ProfunctorState.prototype.runReader = function runReader(...props) {
        return this.computation(...props);
    }
}

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


export default ProfunctorState;
