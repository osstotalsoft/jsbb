import { variadicApply, checkRules } from "../_utils";
import { contramap } from "@totalsoft/zion";
import { chain } from "ramda";

function _chainRules(f1, f2) {
    return f1 |> chain(newModel => f2 |> contramap((model, ctx) => [newModel, ctx]));
}

const chainRules = variadicApply(function chainRules(...rules) {
    checkRules(...rules);

    return rules.reduce(_chainRules);
});

export default chainRules;