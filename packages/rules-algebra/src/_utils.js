// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Rule } from "./rule";

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

export function checkRules(...rules) {
  rules.forEach(function(rule) {
    if (!Rule.is(rule)) {
      throw new Error(`Value '${rule ? rule.toString() : rule}' is not a rule!`);
    }
  });
}
