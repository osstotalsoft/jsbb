// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Success, Failure } from "@totalsoft/pure-validations";

// tslint:disable:no-unnecessary-generics
export function eject<TModel>(validationProxy: ValidationProxy<TModel>): object;

// tslint:disable:no-unnecessary-generics
export function getErrors<TModel>(validationProxy: ValidationProxy<TModel>, separator: string): string;

// tslint:disable:no-unnecessary-generics
export function isValid<TModel>(validationProxy: ValidationProxy<TModel>): boolean;

export type Proxy<T> = {
  [k in keyof T]: ValidationProxy<T[k]>;
};

export type ValidationProxy<TModel> = Proxy<Success<TModel> | Failure<TModel>>;
export function ValidationProxy<TModel>(validation: Success<TModel> | Failure<TModel>): ValidationProxy<TModel>;
