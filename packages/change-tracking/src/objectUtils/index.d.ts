// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

/**
 * Sets the value to an inner property of an object corresponding to the given path.
 * The path can be a dot delimeted string or an array
 */
export function setInnerProp(obj: {}, path: string | string[], value: any): void;

/**
 * Gets the value of the inner property of an object corresponding to the given search key path
 */
export function getInnerProp(obj: {}, searchKeyPath: string[]): any;
