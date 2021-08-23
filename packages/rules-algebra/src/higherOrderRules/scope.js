// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { contramap } from "@totalsoft/zion";

export default function scope(rule) {
  return rule |>
    contramap((model, ctx) => [model, {
      ...ctx,
      document: model,
      prevDocument: ctx.prevModel,
      scopePath: [...ctx.scopePath, ...ctx.fieldPath],      
      fieldPath: []
    }])
}
