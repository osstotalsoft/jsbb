// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Rule } from "../index";

export type Selector<TDocument, TValue> = (document: TDocument) => TValue;

export type MultiSelector<TDocument> = (document: TDocument) => any[];

export type Predicate<TDocument, TValue> = (document: TDocument, prevDocument?: TDocument, value?: TValue) => boolean;

/**
 * Checks if the selected property in the current models differs from the same property in the previous model.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#propertyChanged
 */
export function propertyChanged<TDocument, TValue>(selector: Selector<TDocument, TValue>): Predicate<TDocument, TValue>;

/**
 * Checks if the selected properties in the current models differ from the same properties in the previous model.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#propertiesChanged
 */
export function propertiesChanged<TDocument>(selector: MultiSelector<TDocument>): Predicate<TDocument, any>;

/**
 * Checks if the selected values are equal.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#equals
 */
export function equals<TDocument, TValue>(first: Selector<TDocument, TValue>, second: Selector<TDocument, TValue>): Predicate<TDocument, TValue>;

/**
 * Checks if all the selected values are true.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#all
 */
export function all<TDocument, TValue>(...predicates: Array<Predicate<TDocument, TValue> | TValue>): Predicate<TDocument, TValue>;

/**
 * Checks if any of the selected values are true.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#any
 */
export function any<TDocument, TValue>(...predicates: Array<Predicate<TDocument, TValue> | TValue>): Predicate<TDocument, TValue>;

/**
 * Negates the selected value.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#not
 */
export function not<TDocument, TValue>(predicate: Predicate<TDocument, TValue> | TValue): Predicate<TDocument, TValue>;

/* Checks if the selected property is a number.
* @see https://github.com/osstotalsoft/jsbb/tree/master/packages/rules-algebra#isNumber
*/
export function isNumber<TDocument, TValue>(selector: Selector<TDocument, TValue>): Predicate<TDocument, TValue>;
