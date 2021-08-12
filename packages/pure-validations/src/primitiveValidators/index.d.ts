// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Validator } from "../index";

export const atLeastOne: Validator<any[]>;

export const email: Validator<string>;

export function greaterThan(min: number): Validator<number>;

export function lessThan(max: number): Validator<number>;

export function between(min: number, max: number): Validator<number>;

export function matches(regex: RegExp): Validator<string>;

export function maxLength(max: number): Validator<string>;

export function minLength(min: number): Validator<string>;

export const required: Validator<any>;

export const integer: Validator<any>;

export const number: Validator<any>;

export const valid: Validator<any>;

export function unique(selector: string | string[], displayName: string): Validator<any[]>;
