import Reader from "@totalsoft/zion/data/reader";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";

export default function fromRoot(ruleFactory) {
  return $do(function* () {
    let [model, ctx] = yield Reader.ask();
    while (ctx?.parentModel) {
      model = ctx.parentModel;
      ctx = ctx.parentContext;
    }
    const v = ruleFactory(model);
    checkRules(v);
    return yield v;
  });
}
