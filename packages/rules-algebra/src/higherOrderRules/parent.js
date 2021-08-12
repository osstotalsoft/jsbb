// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { contramap } from "@totalsoft/zion";
import { checkRules } from "../_utils";

export default function parent(rule) {
  checkRules(rule);
  return rule |> contramap((_, ctx) => [ctx.parentModel, ctx.parentContext]);
}
