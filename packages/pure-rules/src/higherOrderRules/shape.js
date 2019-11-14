import Reader from "@totalsoft/zion/data/reader";
import { mergeRight } from "ramda";
import {  $do } from "@totalsoft/zion";
import { field } from "./";


export default function shape(ruleObj) {
    return $do(function* () {
        const [model] = yield Reader.ask();
        if (model === null || model === undefined) {
            return model;
        }

        let acc = model;
        for (var [k, v] of Object.entries(ruleObj)) {
            const val = yield field(k, v);
            if (acc[k] !== val[k]) {
                acc = mergeRight(acc, val)
            }
        }

        return acc;

        // return yield Object.entries(ruleObj)
        //     .map(([k, v]) => field(k, v))
        //     .reduce(concat, unchanged);
    });
}