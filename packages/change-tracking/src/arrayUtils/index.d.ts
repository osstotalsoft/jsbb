// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

/**
 * Ensures unique identifiers for object items in arrays.
 * It returns the same object hierarcy as the model but it attaches unique identifiers to array items.
 * Only items of type "object" will have identifiers added.
 * @see https://github.com/osstotalsoft/jsbb/tree/feature-dirty-info-refactoring/packages/change-tracking#ensurearrayuidsdeep
 */
export function ensureArrayUIDsDeep(model: any): any;

/**
 * Ensures unique identifiers for object items in the given array.
 * It returns the same array as the modeinputl but it attaches unique identifiers to items.
 * Only items of type "object" will have identifiers added.
 * @see https://github.com/osstotalsoft/jsbb/tree/feature-dirty-info-refactoring/packages/change-tracking#ensurearrayuids
 */
export function ensureArrayUIDs(array: any[]): any[];

/**
 * Gets the item with the same uid if it has one or the item at the same index otherwise.
 * @see https://github.com/osstotalsoft/jsbb/tree/feature-dirty-info-refactoring/packages/change-tracking#findmatchingitem
 */
export function findMatchingItem(currentItem: any, currentIndex: number, otherArray: any[]): any[];

/**
 * Transforms an array with object items that have uids to a map where uids are keys.
 * @see https://github.com/osstotalsoft/jsbb/tree/feature-dirty-info-refactoring/packages/change-tracking#touniqueidmap
 */
export function toUniqueIdMap(array: any[]): {[uid: string]: {value: any, index: number}};

/**
 * Checks if the items in the provided arrays have the same order based on the uid or value.
 * @see https://github.com/osstotalsoft/jsbb/tree/feature-dirty-info-refactoring/packages/change-tracking#hasSameItemOrder
 */
export function hasSameItemOrder(firstArray: any[], secondArray: any[]): boolean;
