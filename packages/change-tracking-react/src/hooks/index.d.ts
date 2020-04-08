import { Rule, Logger } from "@totalsoft/rules-algebra";
import { DirtyInfo } from "@totalsoft/change-tracking";
import { Proxy, RulesProfunctorProxy } from "../rulesProfunctorProxy";

/**
 * React hook for field dirty info tracking.
 * Returns a stateful dirty info object, a function that sets the property path as dirty and a function that resets the dirty info state.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react#useDirtyInfo-hook
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
 * React hook for change tracking a model.
 * Returns a stateful model,  stateful dirty info object, a function that sets the model or property value and a function that resets the change tracking.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react#useChangeTrackingState-hook
 */
export function useChangeTrackingState(): [
  // Model
  any,

  // DirtyInfo
  DirtyInfo,

  // Set set model or property value
  (model: any, propertyPath?: string|string[]) => void,

  // Reset dirty info
  (newModel?: any) => void
];
