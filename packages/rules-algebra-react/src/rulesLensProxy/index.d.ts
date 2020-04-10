import { LensProxy } from "@totalsoft/change-tracking-react";

export function eject(rulesLensProxy: RulesLensProxy): object;

export function setValue<TValue>(rulesLensProxy: RulesLensProxy, newValue: TValue): ChangeHandler<TValue>;
export function setValue<TValue>(rulesLensProxy: RulesLensProxy): (newValue: TValue) => ChangeHandler<TValue>;

export function getValue(rulesLensProxy: RulesLensProxy): any;

export function overValue<TValue>(rulesLensProxy: RulesLensProxy, func: (value: TValue) => TValue): void;
export function overValue<TValue>(rulesLensProxy: RulesLensProxy): (func: (value: TValue) => TValue) => void;

export type ChangeHandler<TValue> = (newValue: TValue) => void;
export type RulesLensProxy = LensProxy;
export function RulesLensProxy(ruleResult: any): RulesLensProxy;
