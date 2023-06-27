// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Success, Failure } from "@totalsoft/pure-validations";

export function eject(validationProxy: ValidationProxy<any>): object;

export function getErrors(validationProxy: ValidationProxy<any>, separator: string): string;

export function isValid(validationProxy: ValidationProxy<any>): boolean;

export type Proxy<T> = {
  [k in keyof T]: T[k];
};

export type ValidationProxy<TModel> = Proxy<Success<TModel> | Failure<TModel>>;
export function ValidationProxy<TModel>(validation: Success<TModel> | Failure<TModel>): ValidationProxy<TModel>;
