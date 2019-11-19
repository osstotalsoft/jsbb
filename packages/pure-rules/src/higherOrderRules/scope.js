import { contramap } from "@totalsoft/zion";

export default function scope(scopeSelector, rule) {
  return rule |>
    contramap((model, ctx) => [model, {
      ...ctx,
      document: scopeSelector(ctx.document),
      prevDocument: scopeSelector(ctx.prevDocument)
    }])
}
