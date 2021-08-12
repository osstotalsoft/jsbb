// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { F } from "ts-toolbelt";
/**
 * An object that mimics the structure of the tracked model and specifies the "dirty" status of the properties
 * @see https://github.com/osstotalsoft/jsbb/tree/feature-dirty-info-refactoring/packages/change-tracking#dirty-info
 */
export type DirtyInfo = {
  [key: string]: boolean | DirtyInfo;
};

/**
 * Creates a new DirtyInfo object initialized with the value of the "isDirty" parameter.
 * If the parameter is not provided it is initialized with "false"
 * @see https://github.com/osstotalsoft/jsbb/tree/feature-dirty-info-refactoring/packages/change-tracking#create
 */
export function create(isDirty?: boolean): DirtyInfo;

/**
 * Updates the given DirtyInfo object with the given value for the specified property path.
 * The path can be a dot delimited string or an array
 * @see https://github.com/osstotalsoft/jsbb/tree/feature-dirty-info-refactoring/packages/change-tracking#update
 */
export function update(propertyPath: string | string[], propertyDirtyInfo: boolean, dirtyInfo: DirtyInfo): DirtyInfo;
export function update(propertyPath: string | string[]): F.Curry<(propertyDirtyInfo: boolean, dirtyInfo: DirtyInfo) => DirtyInfo>;

/**
 * Merges two DirtyInfo objects
 * @see https://github.com/osstotalsoft/jsbb/tree/feature-dirty-info-refactoring/packages/change-tracking#merge
 */
export function merge(sourceDirtyInfo: DirtyInfo, targetDirtyInfo: DirtyInfo): DirtyInfo;
export function merge(sourceDirtyInfo: DirtyInfo): (targetDirtyInfo: DirtyInfo) => DirtyInfo;

/**
 * Checks if the specified property is dirty in the given DirtyInfo object
 * @see https://github.com/osstotalsoft/jsbb/tree/feature-dirty-info-refactoring/packages/change-tracking#ispropertydirty
 */
export function isPropertyDirty(propertyPath: string, dirtyInfo: DirtyInfo): boolean;
export function isPropertyDirty(propertyPath: string): (dirtyInfo: DirtyInfo) => boolean;

/**
 * Returns the state of the DirtyInfo object (weather it is dirty or not)
 * @see https://github.com/osstotalsoft/jsbb/tree/feature-dirty-info-refactoring/packages/change-tracking#isdirty
 */
export function isDirty(dirtyInfo: DirtyInfo): boolean;

/**
 * Creates a new DirtyInfo object based on the changes between the model and the previous model.
 * It also takes into account the previous dirtyInfo object if specified.
 * @see https://github.com/osstotalsoft/jsbb/tree/feature-dirty-info-refactoring/packages/change-tracking#detectchanges
 */
export function detectChanges<TModel>(model: TModel, prevModel: TModel, prevDirtyInfo?: DirtyInfo): DirtyInfo;
export function detectChanges<TModel>(model: TModel): F.Curry<(prevModel: TModel, prevDirtyInfo?: DirtyInfo) => DirtyInfo>;
