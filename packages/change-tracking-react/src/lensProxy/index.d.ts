import { ProfunctorState } from "@staltz/use-profunctor-state";

/**
 * Provides access to the inner profunctor
 */
export function eject<TValue>(lens: LensProxy<TValue>): ProfunctorState<TValue>;

/**
 * Sets a new value in the profunctor state
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react/src/lensProxy/README.md#set
 */
export function set<TValue, TResult>(lens: LensProxy<TValue>, newValue: TResult): void;

/**
 * Sets a new value in the profunctor state
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react/src/lensProxy/README.md#set
 */
export function set<TValue, TResult>(lens: LensProxy<TValue>): (newValue: TResult) => void;

/**
 * Read the value from the profunctor state
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react/src/lensProxy/README.md#get
 */
export function get<TValue>(lens: LensProxy<TValue>): TValue;

/**
 * Sets the value from the profunctor state using an updater fn
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react/src/lensProxy/README.md#over
 */
export function over<TValue, TResult>(lens: LensProxy<TValue>, func: (value: TValue) => TResult): void;

/**
 * Sets the value from the profunctor state using an updater fn
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react/src/lensProxy/README.md#over
 */
export function over<TValue, TResult>(lens: LensProxy<TValue>): (func: (value: TValue) => TResult) => void;

/**
 * Map both the getter and the setter to retrieve another lens
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react/src/lensProxy/README.md#promap
 */
export function promap<TValue, TResult>(
  get: (value: TValue) => TResult,
  set: (newValue: TResult, oldState: TValue) => void,
  lens: LensProxy<TValue>
): LensProxy<TResult>;

/**
 * Maps only the getter and returns another lens
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react/src/lensProxy/README.md#lmap
 */
export function lmap<TValue, TResult>(get: (value: TValue) => TResult, lens: LensProxy<TValue>): LensProxy<TResult>;

/**
 * Maps only the setter and returns another lens
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react/src/lensProxy/README.md#rmap
 */
export function rmap<TValue, TResult>(set: (newValue: TResult, oldState: TValue) => void, lens: LensProxy<TValue>): LensProxy<TResult>;

/**
 * Transforms a lens of array into an array of lenses.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react/src/lensProxy/README.md#sequence
 */
export function sequence<TValue>(lens: LensProxy<TValue[]>): LensProxy<TValue>[];

export function LensProxy<TValue>(profunctor: ProfunctorState<TValue>): LensProxy<TValue>;

export type Proxy<T> = {
  [k in keyof T]: T[k];
};


export type LensProxy<TValue> = Proxy<ProfunctorState<TValue>>;

