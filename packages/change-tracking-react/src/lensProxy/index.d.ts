import { ProfunctorState } from "@staltz/use-profunctor-state";

export function eject(rulesProfunctorProxy: LensProxy): object;

export function setValue<TValue>(LensProxy: LensProxy, newValue: TValue): ChangeHandler<TValue>;
export function setValue<TValue>(LensProxy: LensProxy): (newValue: TValue) => ChangeHandler<TValue>;

export function getValue(LensProxy: LensProxy): any;

export function overValue<TValue>(LensProxy: LensProxy, func: (value: TValue) => TValue): void;
export function overValue<TValue>(LensProxy: LensProxy): (func: (value: TValue) => TValue) => void;

export type Proxy<T> = {
  [k in keyof T]: T[k];
};

export type ChangeHandler<TValue> = (newValue: TValue) => void;
export type LensProxy = Proxy<ProfunctorState<any>>;
export function LensProxy(ruleResult: any): LensProxy;
