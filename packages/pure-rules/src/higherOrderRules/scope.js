import { contramap } from "@totalsoft/zion";

export default function scope(rule) {
  return rule |>
    contramap((model, ctx) => [model, {
      ...ctx,
      document: model,
      prevDocument: ctx.prevModel
    }])
}
