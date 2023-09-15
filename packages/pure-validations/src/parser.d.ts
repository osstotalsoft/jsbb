// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Validator } from "./validator";

export type ParserOptions = {
  /**
   * Scope containing functions or values that are accessible from the validator.
   */
  scope: {[key: string]: any}
};

/**
 * Parses a validator from a string.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#parse
 */
export function parse(validator: string, options?: ParserOptions): Validator<any>;
