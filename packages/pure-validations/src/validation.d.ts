// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import ValidationError from "./validationError";

export type Success<TModel> = {
  [k in keyof TModel]: TModel[k];
};

export type Failure<TModel> = {
  [k in keyof TModel]: TModel[k];
};

export function Failure(validationError: ValidationError): Failure<any>;
export function getErrors<TModel>(validation: Success<TModel> | Failure<TModel>): string[];
export function getInner<TModel>(path: string[], validation: Success<TModel> | Failure<TModel>): Success<TModel> | Failure<TModel>;
export function isValid<TModel>(validation: Success<TModel> | Failure<TModel>): boolean;
