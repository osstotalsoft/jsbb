import { Rule } from "../index";

export type Selector<TDocument, TValue> = (document: TDocument) => TValue;

export type MultiSelector<TDocument> = (document: TDocument) => any[];

export type Predicate<TDocument, TValue> = (document: TDocument, prevDocument?: TDocument, value?: TValue) => boolean;

/**
 * Checks if the selected property in the current models differs from the same property in the previous model.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-rules#propertyChanged
 */
export function propertyChanged<TDocument, TValue>(selector: Selector<TDocument, TValue>): Predicate<TDocument, TValue>;

/**
 * Checks if the selected properties in the current models differ from the same properties in the previous model.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-rules#propertiesChanged
 */
export function propertiesChanged<TDocument>(selector: MultiSelector<TDocument>): Predicate<TDocument, any>;

/**
 * Checks if the selected values are equal.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-rules#equals
 */
export function equals<TDocument, TValue>(first: Selector<TDocument, TValue>, second: Selector<TDocument, TValue>): Predicate<TDocument, TValue>;

/**
 * Checks if all the selected values are true.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-rules#all
 */
export function all<TDocument, TValue>(...predicates: Array<Predicate<TDocument, TValue> | TValue>): Predicate<TDocument, TValue>;

/**
 * Checks if any of the selected values are true.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-rules#any
 */
export function any<TDocument, TValue>(...predicates: Array<Predicate<TDocument, TValue> | TValue>): Predicate<TDocument, TValue>;

/**
 * Negates the selected value.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-rules#not
 */
export function not<TDocument, TValue>(predicate: Predicate<TDocument, TValue> | TValue): Predicate<TDocument, TValue>;

/* Checks if the selected property is a number.
* @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-rules#isNumber
*/
export function isNumber<TDocument, TValue>(selector: Selector<TDocument, TValue>): Predicate<TDocument, TValue>;
