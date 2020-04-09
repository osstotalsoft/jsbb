import { F } from "ts-toolbelt";
/**
 * An object that mimics the structure of the tracked model and specifies the "dirty" status of the properties
 */
export type DirtyInfo = {
  [key: string]: boolean | DirtyInfo;
};

/**
 * Creates a new DirtyInfo object initialized with the value of the "isDirty" parameter.
 * If the parameter is not provided it is initialized with "false"
 */
export function create(isDirty?: boolean): DirtyInfo;

/**
 * Updates the given DirtyInfo object with the given value for the specified property path.
 * The path can be a dot delimited string or an array
 */
export function update(propertyPath: string | string[], propertyDirtyInfo: boolean, dirtyInfo: DirtyInfo): DirtyInfo;
export function update(propertyPath: string | string[]): F.Curry<(propertyDirtyInfo: boolean, dirtyInfo: DirtyInfo) => DirtyInfo>;

/**
 * Merges two DirtyInfo objects
 */
export function merge(sourceDirtyInfo: DirtyInfo, targetDirtyInfo: DirtyInfo): DirtyInfo;
export function merge(sourceDirtyInfo: DirtyInfo): (targetDirtyInfo: DirtyInfo) => DirtyInfo;

/**
 * Checks if the specified property is dirty in the given DirtyInfo object
 */
export function isPropertyDirty(propertyPath: string, dirtyInfo: DirtyInfo): boolean;
export function isPropertyDirty(propertyPath: string): (dirtyInfo: DirtyInfo) => boolean;

/**
 * Returns the state of the DirtyInfo object (weather it is dirty or not)
 */
export function isDirty(dirtyInfo: DirtyInfo): boolean;

/**
 * Creates a new DirtyInfo object based on the changes between the model and the previous model.
 * It also takes into account the previous dirtyInfo object if specified.
 */
export function detectChanges<TModel>(model: TModel, prevModel: TModel, prevDirtyInfo?: DirtyInfo): DirtyInfo;
export function detectChanges<TModel>(model: TModel): F.Curry<(prevModel: TModel, prevDirtyInfo?: DirtyInfo) => DirtyInfo>;
