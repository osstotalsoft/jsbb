import { ProfunctorState } from "@staltz/use-profunctor-state";

export function eject<TValue>(lens: LensProxy<TValue>): ProfunctorState<TValue>;

export function set<TValue, TResult>(lens: LensProxy<TValue>, newValue: TResult): void;
export function set<TValue, TResult>(lens: LensProxy<TValue>): (newValue: TResult) => void;

export function get<TValue>(lens: LensProxy<TValue>): TValue;

export function over<TValue, TResult>(lens: LensProxy<TValue>, func: (value: TValue) => TResult): void;
export function over<TValue, TResult>(lens: LensProxy<TValue>): (func: (value: TValue) => TResult) => void;

export function promap<TValue, TResult>(
  get: (value: TValue) => TResult,
  set: (newValue: TResult, oldState: TValue) => void,
  lens: LensProxy<TValue>
): LensProxy<TResult>;

export function lmap<TValue, TResult>(get: (value: TValue) => TResult, lens: LensProxy<TValue>): LensProxy<TResult>;

export function rmap<TValue, TResult>(set: (newValue: TResult, oldState: TValue) => void, lens: LensProxy<TValue>): LensProxy<TResult>;

export function sequence<TValue>(lens: LensProxy<TValue[]>): LensProxy<TValue>[];

export function LensProxy<TValue>(profunctor: ProfunctorState<TValue>): LensProxy<TValue>;

export type Proxy<T> = {
  [k in keyof T]: T[k];
};


export type LensProxy<TValue> = Proxy<ProfunctorState<TValue>>;

