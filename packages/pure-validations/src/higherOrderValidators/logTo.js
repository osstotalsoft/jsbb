// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { contramap } from "@totalsoft/zion";
import { checkValidators } from "./_utils";
import { curry } from "ramda";

const logTo = curry(function logTo(logger, validator) {
  checkValidators(validator);
  return validator |> contramap((model, context) => [model, { ...context, log: true, logger }]);
});

export default logTo;
