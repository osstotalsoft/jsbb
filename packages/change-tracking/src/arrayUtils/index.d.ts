/**
 * Ensures unique identifiers for object items in arrays.
 * The received model can be an object that contains arrays in the nesting hierarchy
 * Returns the same object hierarcy as the model with arrays that have unique ids as keys.
 */
export function ensureArrayUIDsDeep(model: any): any;

/**
 * Ensures unique identifiers for object items in the given array.
 * Returns the same array with unique ids as keys.
 */
export function ensureArrayUIDs(array: any[]): any[];

/**
 * Gets the item with the same uid if it has one or the item at the same index otherwise.
 */
export function findMatchingItem(currentItem: any, currentIndex: number, otherArray: any[]): any[];

/**
 * Transforms an array with object items that have uids to a map where uids are keys.
 */
export function toUniqueIdMap(array: any[]): {[uid: string]: {value: any, index: number}};
