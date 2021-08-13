import { Rule } from "../rule";
import { map, compose } from "ramda";
import { $do } from "@totalsoft/zion";
import { field, chainRules } from "./";
import scope from "./scope"

function _shape(ruleObj) {
    return $do(function* () {
        const [model] = yield Rule.ask();
        if (model === null || model === undefined) {
            return model;
        }

        return yield Object.entries(ruleObj)
            |> map(([k, v]) => field(k, v))
            |> chainRules;
    });
}

export default compose(scope, _shape)