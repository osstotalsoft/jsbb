// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { ValidationError } from "../index";
import { Validator, ValidatorContext } from "../validator";

/**
 * Used to reduce a list of validators. It calls all validators and concatenate their failures.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#concatfailure
 */
export function concatFailure<TModel>(validators: Array<Validator<TModel>>): Validator<TModel>;

/**
 * Sets a custom error message for validation errors. The message can also be a translation key.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#errorMessage
 */
export function errorMessage<TModel>(message: string, validator: Validator<TModel>): Validator<TModel>;

/**
 * Sets a custom error message for validation errors. The message can also be a translation key.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#errorMessage
 */
export function errorMessage<TModel>(message: string): (validator: Validator<TModel>) => Validator<TModel>;

/**
 * Used to validate just a field of the model.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#field
 */
export function field(key: string, validator: Validator<any>): Validator<object>;

/**
 * Used to validate just a field of the model.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#field
 */
export function field(key: string): (validator: Validator<any>) => Validator<object>;

export type FilterFunc = (ctx: ValidatorContext) => boolean;

/**
 * Applies validation only on the fields filtered according to the speciffied predicate.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#filterFields
 */
export function filterFields(fieldFilter: FilterFunc, validator: Validator<object>): Validator<object>;

/**
 * Applies validation only on the fields filtered according to the speciffied predicate.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#filterFields
 */
export function filterFields(fieldFilter: FilterFunc): (validator: Validator<object>) => Validator<object>;

/**
 * Useful when you need the model in the composition process.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#frommodel
 */
export function fromModel<TModel>(validatorFactory: (model: TModel) => Validator<TModel>): Validator<TModel>;

/**
 * Useful when you need the parent model in the composition process.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#fromparent
 */
export function fromParent<TModel>(validatorFactory: (parentModel: any) => Validator<TModel>): Validator<TModel>;

/**
 * Useful when you need the root model in the composition process.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#fromroot
 */
export function fromRoot<TModel>(validatorFactory: (rootModel: any) => Validator<TModel>): Validator<TModel>;

/**
 * Takes an item validator and produces a validator for each item in the provided collection.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#items
 */
export function items<TItem>(itemValidator: Validator<TItem>): Validator<TItem[]>;

export type Logger = { log: (message: string) => void };

/**
 * Logs the validation process to the speficfied logger.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#logto
 */
export function logTo<TModel>(logger: Logger, validator: Validator<TModel>): Validator<TModel>;

/**
 * Logs the validation process to the speficfied logger.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#logto
 */
export function logTo<TModel>(logger: Logger): (validator: Validator<TModel>) => Validator<TModel>;

export type Reader<TContext, TValue> = { computation: (ctx: TContext) => TValue };
export function parent(reader: Reader<any, any>): Reader<any, any>;

export function readFrom<TContext, TValue>(func: (ctx: TContext) => TValue): Reader<TContext, TValue>;

/**
 * Used to compose a complex validator from field validators.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#shape
 */
export function shape<TValidatorObj extends { [k: string]: Validator<unknown> }>(
  validatorObj: TValidatorObj
): Validator<{ [k in keyof TValidatorObj]: TValidatorObj[k] extends Validator<infer U> ? U : unknown }>;

/**
 * Used to reduce a list of validators. It calls all the validators until it receives a failure.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#stoponfirstfailure
 */
export function stopOnFirstFailure<TModel>(validators: Array<Validator<TModel>>): Validator<TModel>;

/**
 * Used to create a conditional validator by providing a predicate or condition and a validator.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#stoponfirstfailure
 */
export function when<TModel>(condition: boolean | ((model: TModel, ctx?: any) => boolean), validator: Validator<TModel>): Validator<TModel>;

/**
 * Used to create a conditional validator by providing a predicate or condition and a validator.
 * @see https://github.com/osstotalsoft/jsbb/tree/master/packages/pure-validations#stoponfirstfailure
 */
export function when<TModel>(condition: boolean | ((model: TModel, ctx?: any) => boolean)): (validator: Validator<TModel>) => Validator<TModel>;
