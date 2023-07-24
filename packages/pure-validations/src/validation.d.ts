// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import ValidationError from "./validationError";

export interface Success {}
export interface Failure {}

export const Success: Success;
export function Failure(validationError: ValidationError): Failure;
export function getErrors(validation: Success | Failure): string[];
export function getInner(path: string[], validation: Success | Failure): Success | Failure;
export function isValid(validation: Success | Failure): boolean;
