export type StateLens<TState> = { state: TState, setState: (prevState: TState) => TState };

/**
 * Provides access to the inner profunctor state
 */
export function eject<TValue>(lens: LensProxy<TValue>): StateLens<TValue>;

/**
 * Sets a new value in the profunctor state
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react/src/lensProxy/README.md#set
 */
export function set(lens: LensProxy<any>, newValue: any): void;

/**
 * Sets a new value in the profunctor state
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react/src/lensProxy/README.md#set
 */
export function set(lens: LensProxy<any>): (newValue: any) => void;

/**
 * Read the value from the profunctor state
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react/src/lensProxy/README.md#get
 */
export function get<TValue>(lens: LensProxy<TValue>): TValue;

/**
 * Sets the value from the profunctor state using an updater fn
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react/src/lensProxy/README.md#over
 */
export function over<TValue>(lens: LensProxy<TValue>, func: (value: TValue) => any): void;

/**
 * Sets the value from the profunctor state using an updater fn
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react/src/lensProxy/README.md#over
 */
export function over<TValue>(lens: LensProxy<TValue>): (func: (value: TValue) => any) => void;

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
export function sequence<TValue>(lens: LensProxy<TValue[]>): Array<LensProxy<TValue>>;

/**
 * Pipes a lens to a Ramda lens. Both the getters and setters are piped.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/change-tracking-react/src/lensProxy/README.md#pipe
 */
export function pipe(lens: LensProxy<any>, otherLens: any): LensProxy<any>;

/**
 * Creates a LensProxy over an existing lens
 */
export function LensProxy<TValue>(lens: StateLens<TValue>): LensProxy<TValue>;

/**
 * Creates a StateLens and a proxy over it
 */
export function StateLensProxy<TState>(state: TState, setState: (prevState: TState) => TState): LensProxy<TState>;

export type Proxy<T> = {
  [k in keyof T]: T[k];
};

export type LensProxy<TValue> = Proxy<StateLens<TValue>>;
