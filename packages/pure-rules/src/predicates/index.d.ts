import { Rule } from "../index";

export type Selector<TDocument, TValue> = (document: TDocument) => TValue;

export type MultiSelector<TDocument> = (document: TDocument) => any[];

export type Predicate<TDocument, TValue> = (document: TDocument, prevDocument?: TDocument, value?: TValue) => boolean;

export function propertyChanged<TDocument, TValue>(selector: Selector<TDocument, TValue>): Predicate<TDocument, TValue>;

export function propertiesChanged<TDocument>(selector: MultiSelector<TDocument>): Predicate<TDocument, any>;

export function equals<TDocument, TValue>(first: Selector<TDocument, TValue>, second: Selector<TDocument, TValue>): Predicate<TDocument, TValue>;

export function all<TDocument, TValue>(...predicates: Array<Predicate<TDocument, TValue> | TValue>): Predicate<TDocument, TValue>;

export function any<TDocument, TValue>(...predicates: Array<Predicate<TDocument, TValue> | TValue>): Predicate<TDocument, TValue>;

export function not<TDocument, TValue>(predicate: Predicate<TDocument, TValue> | TValue): Predicate<TDocument, TValue>;

export function isNumber<TDocument, TValue>(selector: Selector<TDocument, TValue>): Predicate<TDocument, TValue>;
