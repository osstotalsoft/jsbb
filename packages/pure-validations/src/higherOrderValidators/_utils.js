// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Validator } from "../validator";

export function variadicApply(variadicFn) {
  const res = function(...args) {
    if (args.length === 1 && Array.isArray(args[0])) {
      return variadicFn(...args[0]);
    }

    return variadicFn(...args);
  };
  res.toString = function() {
    return variadicFn.toString();
  };
  return res;
}

export function checkValidators(...validators) {
  validators.forEach(function(validator) {
    if (!Validator.is(validator)) {
      throw new Error(`Value '${validator ? validator.toString() : validator}' is not a validator!`);
    }
  });
}
