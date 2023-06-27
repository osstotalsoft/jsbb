// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { DirtyInfo } from "@totalsoft/change-tracking";
import { Validator, Logger, FilterFunc, Success, Failure } from "@totalsoft/pure-validations";
import { ValidatorContext } from "packages/pure-validations/src/validator";
import { ValidationProxy } from "../validationProxy";

/**
 * React hook for model validation using the @totalsof/pure-validation library.
 * Returns a statefull validation result, a function that performs the validation and a function that resets the validation state.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations-react#usevalidation-hook
 */
export function useValidation<TModel>(
  rules: Validator<TModel>,
  options?: { isLogEnabled: boolean; logger: Logger; fieldFilterFunc: FilterFunc },
  deps?: any[]
): [
  // Validation result
  ValidationProxy<TModel>,

  // Validate function
  (model: TModel, context?: ValidatorContext) => boolean,

  // Reset validation function
  () => void
];

/**
 * React hook that uses dirty fields info to validate only the fields that were modified.
 * Returns a statefull validation result, a function that performs the validation and a function that resets the validation state.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations-react#usedirtyfieldvalidation-hook
 */
export function useDirtyFieldValidation<TModel>(
  rules: Validator<TModel>,
  options?: { isLogEnabled: boolean; logger: Logger; fieldFilterFunc: FilterFunc },
  deps?: any[]
): [
  // Validation result
  ValidationProxy<TModel>,

  // Validate function
  (model: TModel, dirtyinfo?: DirtyInfo) => boolean,

  // Reset validation function
  () => void
];
