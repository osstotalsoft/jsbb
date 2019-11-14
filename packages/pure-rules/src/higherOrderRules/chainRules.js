import { variadicApply, checkRules } from "../_utils";
import { contramap, $do } from "@totalsoft/zion";

function _chainRules(f1, f2) {
    //return f1 |> chain(newModel => f2.contramap((model, ctx) => [newModel, ctx]));
    return $do(function* () {
        const newModel = yield f1;
        const result = yield (f2 |> contramap((model, ctx) => [newModel, ctx]));
        return result;
    });
}

const chainRules = variadicApply(function chainRules(...rules) {
    checkRules(...rules);
    return rules.reduce(_chainRules);
});

export default chainRules;
