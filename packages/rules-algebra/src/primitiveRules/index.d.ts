// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Rule } from "../index";

export type Computation<TDocument, TValue> = (document: TDocument, prevDocument?: TDocument, value?: TValue) => TValue;

/**
 * A rule that does not change the value. Used for composition with other rules.
 */
export const unchanged: Rule<any>;

/**
 * A rule that returns the spciffied value regardless of the model.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#constant
 */
export function constant<TValue>(value: TValue): Rule<TValue>;

/**
 * A rule that returns a value computed based on the "document" in scope and its previous value.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#computed
 */
export function computed<TValue>(computation: Computation<any, TValue>): Rule<TValue>;

/**
 * A rule that returns the minimum of two properties or values.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#min
 */
export function min<TDocument, TValue>(first: TValue | Computation<TDocument, TValue>, second: TValue | Computation<TDocument, TValue>): Rule<TValue>;

/**
 * A rule that returns the minimum of two properties or values.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#min
 */
export function min<TDocument, TValue>(first: TValue | Computation<TDocument, TValue>): (second: TValue | Computation<TDocument, TValue>) => Rule<TValue>;

/**
 * A rule that returns the maximum of two properties or values.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#max
 */
export function max<TDocument, TValue>(first: TValue | Computation<TDocument, TValue>, second: TValue | Computation<TDocument, TValue>): Rule<TValue>;

/**
 * A rule that returns the maximum of two properties or values.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#max
 */
export function max<TDocument, TValue>(first: TValue | Computation<TDocument, TValue>): (second: TValue | Computation<TDocument, TValue>) => Rule<TValue>;

/**
 * A rule that returns the sum between two prperties or values.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#sum
 */
export function sum<TDocument, TValue>(first: TValue | Computation<TDocument, TValue>, second: TValue | Computation<TDocument, TValue>): Rule<TValue>;

/**
 * A rule that returns the sum between two prperties or values.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#sum
 */
export function sum<TDocument, TValue>(first: TValue | Computation<TDocument, TValue>): (second: TValue | Computation<TDocument, TValue>) => Rule<TValue>;

/**
 * A rule that returns the minimum between the current value and the argument.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#minimumValue
 */
export function minimumValue<TValue>(other: TValue | Computation<any, TValue>): Rule<TValue>;

/**
 * A rule that returns the maximum between the current value and the argument.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#maximumValue
 */
export function maximumValue<TValue>(other: TValue | Computation<any, TValue>): Rule<TValue>;

/**
 * A rule that returns a string produced according to the provided format.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#sprintf
 */
export function sprintf(format: string): Rule<string>;
