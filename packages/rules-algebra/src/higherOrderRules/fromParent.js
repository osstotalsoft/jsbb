import { Rule } from "../rule";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";

export default function fromParent(ruleFactory) {
  return $do(function* () {
    const [model, { parentModel }] = yield Rule.ask();
    if (parentModel === null || parentModel === undefined) {
      return model;
    }
    const v = ruleFactory(parentModel);
    checkRules(v);
    return yield v;
  });
}
