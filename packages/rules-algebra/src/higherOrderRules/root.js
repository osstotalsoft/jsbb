import { contramap } from "@totalsoft/zion";
import { checkRules } from "../_utils";

export default function root(rule) {
  checkRules(rule);
  return rule |> contramap((_, ctx) => _getRootModelAndContext(ctx));
}

function _getRootModelAndContext(currentContext) {
  let [model, ctx] = [undefined, currentContext];

  while (ctx?.parentModel) {
    model = ctx.parentModel;
    ctx = ctx.parentContext;
  }

  return [model, ctx]
}