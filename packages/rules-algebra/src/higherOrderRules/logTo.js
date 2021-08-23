// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { contramap } from "@totalsoft/zion";
import { checkRules } from "../_utils";
import { curry } from "ramda";

const logTo = curry(function logTo(logger, rule) {
  checkRules(rule);
  return rule |> contramap((model, context) => [model, { ...context, log: true, logger }]);
});

export default logTo;
