import { Validator, Logger, FilterFunc, Success, Failure } from "@totalsoft/pure-validations";
import { ValidatorContext } from "packages/pure-validations/src/validator";

/**
 * React hook for model validation using the @totalsof/pure-validation library.
 * Returns a statefull validation result, a function that performs the validation and a function that resets the validation state.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations-react#usevalidation-hook
 */
export function useValidation(
  rules: Validator<any>,
  options?: { isLogEnabled: boolean; logger: Logger; fieldFilterFunc: FilterFunc },
  deps?: any[]
): [
  // Validation result
  Success | Failure,

  // Validate function
  (model: any, context?: ValidatorContext) => boolean,

  // Reset validation function
  () => void
];

/**
 * React hook that uses dirty fields info to validate only the fields that were modified.
 * Returns a statefull validation result, a function that performs the validation and a function that resets the validation state.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations-react#usedirtyfieldvalidation-hook
 */
export function useDirtyFieldValidation(
  rules: Validator<any>,
  options?: { isLogEnabled: boolean; logger: Logger; fieldFilterFunc: FilterFunc },
  deps?: any[]
): [
  // Validation result
  Success | Failure,

  // Validate function
  (model: any, dirtyinfo?: any) => boolean,

  // Reset validation function
  () => void
];
