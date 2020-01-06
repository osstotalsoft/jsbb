import { Rule, Logger } from "@totalsoft/pure-rules";
import { RuleContext } from "packages/pure-rules/src/rule";
import { DirtyInfo } from "../dirtyInfo";
import { Proxy, RulesProfunctorProxy } from "../rulesProfunctorProxy";

/**
 * React hook for field dirty info tracking.
 * Returns a statefull dirty info object, a function that performs sets the property path as dirty and a function that resets the dirty info state.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-rules-react#useDirtyInfo-hook
 */
export function useDirtyInfo(): [
  // DirtyInfo
  DirtyInfo,

  // Set dirty info for the property path
  (propertyPath: string) => void,

  // Reset dirty info
  () => void
];

/**
 * React hook that applies the buisiness rules and keeps track of user modified values (dirty field info).
 * Returns a statefull rule application result, a dirty info object, a function that sets a value for the given property
 * path and a function that resets the rule engine state.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations-react#usedirtyfieldvalidation-hook
 */
export function useRulesEngine(
  rules: Rule<any>,
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
 * React hook that applies the buisiness rules and keeps track of user modified values (dirty field info).
 * Returns a statefull profunctor with the rule application result, a dirty info object path and a function that resets the rule engine state.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations-react#usedirtyfieldvalidation-hook
 */
export function useRulesEngineProfunctor(
  rules: Rule<any>,
  options?: { isLogEnabled: boolean; logger: Logger; },
  deps?: any[]
): [
  // Validation result
  RulesProfunctorProxy,

  DirtyInfo,

  // Set a value at the given property path
  (propertyPath: string, value: any) => void,

  // Resets rule engine changes ands sets a new model
  (newModel: any) => void
];
