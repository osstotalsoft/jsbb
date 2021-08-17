import { Validator } from "../validator";
import { $do } from "@totalsoft/zion";
import { checkValidators } from "./_utils";

export default function fromRoot(validatorFactory) {
  return $do(function*() {
    let [model, ctx] = yield Validator.ask();

    while (ctx?.parentModel) {
      model = ctx.parentModel;
      ctx = ctx.parentCtx;
    }

    const v = validatorFactory(model);
    checkValidators(v);
    return yield v;
  });
}
