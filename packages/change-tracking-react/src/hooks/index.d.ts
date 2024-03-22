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

  // Reset dirty info
  (newModel?: TModel) => void
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

  // Resets the change tracking and optionally sets a new model
  (newModel?: TModel | ((param?: TModel) => TModel)) => void
];
