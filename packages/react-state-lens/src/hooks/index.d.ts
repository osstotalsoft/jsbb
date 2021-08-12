// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { DirtyInfo } from "@totalsoft/change-tracking";
import { LensProxy } from "../lensProxy";

/**
 * Provides a stateful profunctor lens over the model.
 * Receives the initial model
 * Returns a stateful profunctor over the model.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/react-state-lens#usestatelens-hook
 */
export function useStateLens(
  initialModel: any,
  deps: any[]
): [
  // Model lens
  LensProxy<any>
];
