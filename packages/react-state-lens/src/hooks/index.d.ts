import { DirtyInfo } from "@totalsoft/change-tracking";
import { LensProxy } from "../lensProxy";

/**
 * Provides a stateful profunctor lens over the model.
 * Receives the initial model
 * Returns a stateful profunctor over the model.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/lens-state-react#useStateLens
 */
export function useStateLens(
  initialModel: any,
  deps: any[]
): [
  // Model lens
  LensProxy<any>
];
