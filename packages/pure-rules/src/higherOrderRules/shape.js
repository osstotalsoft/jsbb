import Reader from "@totalsoft/zion/data/reader";
import { map } from "ramda";
import { $do } from "@totalsoft/zion";
import { field, chainRules } from "./";


export default function shape(ruleObj) {
    return $do(function* () {
        const [model] = yield Reader.ask();
        if (model === null || model === undefined) {
            return model;
        }

        return yield Object.entries(ruleObj)
            |> map(([k, v]) => field(k, v))
            |> chainRules;
    });
}