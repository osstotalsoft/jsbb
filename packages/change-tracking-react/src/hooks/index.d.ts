import { DirtyInfo } from "@totalsoft/change-tracking";
import { LensProxy } from "../lensProxy";

/**
 * Keeps track of modified properties of an external model.
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
 * Provides a stateful model with change tracking.
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

/**
 * Provides a stateful model with change tracking using a profunctor lens.
 * Receives the initial model
 * Returns a stateful profunctor lens with the rule application result, a dirty info object and a function that resets the change tracking.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react#useChangeTrackingLens-hook
 */
export function useChangeTrackingLens(
  initialModel: any,
): [
  // Model lens
  LensProxy,

  // DirtyInfo object
  DirtyInfo,

  // Resets the change tracking and optionally sets a new model
  (newModel?: any) => void
];
