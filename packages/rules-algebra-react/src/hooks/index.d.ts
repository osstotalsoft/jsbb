import { Rule, Logger } from "@totalsoft/rules-algebra";
import { DirtyInfo } from "@totalsoft/change-tracking";
import { LensProxy } from "@totalsoft/react-state-lens";

/**
 * React hook that applies the business rules and keeps track of user modified values (dirty field info).
 * Receives the rules, the initial model. Optional arguments are the settings and dependencies
 * Returns a stateful rule application result, a dirty info object, a function that sets a value for the given property path and a function that resets the rule engine state.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra-react#useRules-hook
 */
export function useRules(
  rules: Rule<any>,
  initialModel: any,
  options?: { isLogEnabled: boolean; logger: Logger; },
  deps?: any[]
): [
  // Validation result
  any,

  DirtyInfo,

  // Set a value at the given property path
  (propertyPath: string, value: any) => void,

  // Resets rule engine changes ands sets a new model
  (newModel: any) => void
];

/**
 * React hook that applies the business rules and keeps track of user modified values (dirty field info).
 * Receives the rules, the initial model. Optional arguments are the settings and dependencies
 * Returns a stateful profunctor lens with the rule application result, a dirty info object and a function that resets the rule engine state.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra-react#useRulesLens-hook
 */
export function useRulesLens(
  rules: Rule<any>,
  initialModel: any,
  options?: { isLogEnabled: boolean; logger: Logger; },
  deps?: any[]
): [
  // Model lens
  LensProxy<any>,

  DirtyInfo,

  // Set a value at the given property path
  (propertyPath: string, value: any) => void,

  // Resets rule engine changes ands sets a new model
  (newModel: any) => void
];
