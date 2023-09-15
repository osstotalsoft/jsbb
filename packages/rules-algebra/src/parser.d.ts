// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Rule } from "./rule";

export type ParserOptions = {
  /**
   * Scope containing functions or values that are accessible from the rule.
   */
  scope: {[key: string]: any}
};

/**
 * Parses a rule from a string.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#parse
 */
export function parse(rule: string, options?: ParserOptions): Rule<any>;
