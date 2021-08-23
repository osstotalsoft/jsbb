// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Success, Failure } from "@totalsoft/pure-validations";

export function eject(validationProxy: ValidationProxy): object;

export function getErrors(validationProxy: ValidationProxy, separator: string): string;

export function isValid(validationProxy: ValidationProxy): boolean;

export type Proxy<T> = {
  [k in keyof T]: T[k];
};

export type ValidationProxy = Proxy<Success | Failure>;
export function ValidationProxy(validation: Success | Failure): ValidationProxy;
