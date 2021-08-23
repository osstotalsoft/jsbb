// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { contramap } from "@totalsoft/zion";
import { checkValidators } from "./_utils";
import { curry } from "ramda";

const filterFields = curry(function filterFields(fieldFilter, validator) {
  checkValidators(validator);
  return validator |> contramap((model, context) => [model, { ...context, fieldFilter }]);
});

export default filterFields;
