import { variadicApply, checkRules } from "../_utils";
import { chain } from "ramda";
import { contramap } from "@totalsoft/zion";
import { setInnerProp } from "../objectUtils";

function _concat(rule1, rule2) {
    return rule1 |> chain(newModel => rule2 |> contramap((model, ctx) => [newModel, _getContext(model, newModel, ctx)]))
}

function _getContext(model, newModel, ctx) {
    const { fieldPath, document } = ctx;
    return model === newModel ? ctx : { ...ctx, document: setInnerProp(document, fieldPath, newModel) }
}

const chainRules = variadicApply(function chainRules(...rules) {
    checkRules(...rules);

    return rules.reduce(_concat);
});

export default chainRules;
