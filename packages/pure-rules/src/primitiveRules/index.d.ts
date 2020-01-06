import { Rule } from "../index";

export type Computation<TDocument, TValue> = (document: TDocument, prevDocument?: TDocument, value?: TValue) => TValue;

export const unchanged: Rule<any>;

export function constant<TValue>(value: TValue): Rule<TValue>;

export function computed<TValue>(computation: Computation<any, TValue>): Rule<TValue>;

export function min<TDocument, TValue>(first: TValue | Computation<TDocument, TValue>, second: TValue | Computation<TDocument, TValue>): Rule<TValue>;

export function min<TDocument, TValue>(first: TValue | Computation<TDocument, TValue>): (second: TValue | Computation<TDocument, TValue>) => Rule<TValue>;

export function max<TDocument, TValue>(first: TValue | Computation<TDocument, TValue>, second: TValue | Computation<TDocument, TValue>): Rule<TValue>;

export function max<TDocument, TValue>(first: TValue | Computation<TDocument, TValue>): (second: TValue | Computation<TDocument, TValue>) => Rule<TValue>;

export function sum<TDocument, TValue>(first: TValue | Computation<TDocument, TValue>, second: TValue | Computation<TDocument, TValue>): Rule<TValue>;

export function sum<TDocument, TValue>(first: TValue | Computation<TDocument, TValue>): (second: TValue | Computation<TDocument, TValue>) => Rule<TValue>;

export function minimumValue<TValue>(other: TValue | Computation<any, TValue>): Rule<TValue>;

export function maximumValue<TValue>(other: TValue | Computation<any, TValue>): Rule<TValue>;
