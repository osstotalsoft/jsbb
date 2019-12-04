import { Success, Failure } from "@totalsoft/pure-validations";
import { ProfunctorState } from "@staltz/use-profunctor-state";

export function eject(rulesProfunctorProxy: RulesProfunctorProxy): object;

export function onChanged<TValue>(rulesProfunctorProxy: RulesProfunctorProxy, newValue: TValue): ChangeHandler<TValue>;
export function onChanged<TValue>(rulesProfunctorProxy: RulesProfunctorProxy): (newValue: TValue) => ChangeHandler<TValue>;

export function getValue(rulesProfunctorProxy: RulesProfunctorProxy): any;

export type Proxy<T> = {
  [k in keyof T]: T[k];
};

export type ChangeHandler<TValue> = (newValue: TValue) => void;
export type RulesProfunctorProxy = Proxy<ProfunctorState<any>>;
export function ValidationProxy(ruleResult: any): RulesProfunctorProxy;
