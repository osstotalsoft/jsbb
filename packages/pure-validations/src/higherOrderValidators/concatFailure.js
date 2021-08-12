// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { concat } from "ramda";
import { variadicApply, checkValidators } from "./_utils";

const concatFailure = variadicApply(function concatFailure(...validators) {
  checkValidators(...validators);
  return validators.reduce(concat);
});

export default concatFailure;
