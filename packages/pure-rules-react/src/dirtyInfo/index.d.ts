export type DirtyInfo = {
  [key: string]: boolean | DirtyInfo;
};

export function create(isDirty: boolean): DirtyInfo;
export function update(propertyPath: string | string[], propertyDirtyInfo: boolean, dirtyInfo: DirtyInfo): void;
export function merge(sourceDirtyInfo: DirtyInfo, targetDirtyInfo: DirtyInfo): void;
export function isPropertyDirty(propertyPath: string, dirtyInfo: DirtyInfo): boolean;
