import Reader from "@totalsoft/zion/data/reader";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";

export default function fromModel(ruleFactory) {
  return $do(function* () {
    const [model] = yield Reader.ask();
    if (model === null || model === undefined) {
      return model;
    }
    const v = ruleFactory(model);
    checkRules(v);
    return yield v;
  });
}
