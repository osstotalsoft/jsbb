import { Rule } from "../rule";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";

export default function fromRoot(ruleFactory) {
  return $do(function* () {
    let [model, ctx] = yield Rule.ask();
    while (ctx?.parentModel) {
      model = ctx.parentModel;
      ctx = ctx.parentContext;
    }
    const v = ruleFactory(model);
    checkRules(v);
    return yield v;
  });
}
