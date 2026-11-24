// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { DirtyInfo } from "@totalsoft/change-tracking";
import { LensProxy } from "@totalsoft/react-state-lens";

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
 * Options for the reset function returned by useChangeTrackingState and useChangeTrackingLens.
 */
export interface ResetOptions {
  /**
   * When true, the reset only sets the model and keeps the dirty info as it is:
   * no property is marked dirty and the existing dirty flags are not cleared.
   * Useful for merging server-side changes into a model the user is editing. Defaults to false.
   */
  keepDirtyInfo?: boolean;
}

/**
 * Provides a stateful model with change tracking.
 * Returns a stateful model,  stateful dirty info object, a function that sets the model or property value and a function that resets the change tracking.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react#useChangeTrackingState-hook
 */
export function useChangeTrackingState<TModel>(initialModel?: TModel): [
  // Model
  TModel,

  // DirtyInfo
  DirtyInfo,

  // Set set model or property value
  (model: TModel, propertyPath?: string | string[]) => void,

  // Reset dirty info and optionally set a new model (or compute it from the pending model with an updater fn).
  // With { keepDirtyInfo: true } only the model is set and the dirty info is kept as it is.
  (newModel?: TModel | ((param?: TModel) => TModel), options?: ResetOptions) => void
];

/**
 * Provides a stateful model with change tracking using a profunctor lens.
 * Receives the initial model
 * Returns a stateful profunctor lens with the rule application result, a dirty info object and a function that resets the change tracking.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react#useChangeTrackingLens-hook
 */
export function useChangeTrackingLens<TModel>(initialModel: TModel): [
  // Model lens
  LensProxy<TModel>,

  // DirtyInfo object
  DirtyInfo,

  // Resets the change tracking and optionally sets a new model.
  // With { keepDirtyInfo: true } only the model is set and the dirty info is kept as it is.
  (newModel?: TModel | ((param?: TModel) => TModel), options?: ResetOptions) => void
];
