import uniqid from "uniqid"
import { find, reduce, addIndex } from "ramda";

const uniqueIdSymbol = Symbol("uid");

const reduceIndexed = addIndex(reduce)

export function ensureArrayUIDsDeep(model) {
    if (typeof (model) !== "object" || model === null)
        return model;

    if (Array.isArray(model)) {
        model = model.map(_ensureUniqueId)
    }

    return Object.entries(model)
        .reduce((acc, [k, v]) => { acc[k] = ensureArrayUIDsDeep(v); return acc; }, model)
}

export function ensureArrayUIDs(array) {
    if (!Array.isArray(array)) {
        return array;
    }

    return array.map(_ensureUniqueId)
}

export function findMatchingItem(currentItem, currentKey, otherArray) {
    if (!Array.isArray(otherArray)) {
        return undefined;
    }

    return typeof (currentItem) === "object" && uniqueIdSymbol in currentItem
        ? otherArray |> find(prevItem => prevItem[uniqueIdSymbol] === currentItem[uniqueIdSymbol])
        : otherArray[currentKey];
}

export function toUniqueIdMap(array) {
    if (!Array.isArray(array) || array.length === 0) {
        return {};
    }

    return array |> reduceIndexed((acc, value, index) => {
        acc[value[uniqueIdSymbol] || index] = { value, index }
        return acc;
    }, {})
}

function _ensureUniqueId(item) {
    if (typeof (item) === "object" && item[uniqueIdSymbol] === undefined) {
        item[uniqueIdSymbol] = uniqid()
    }
    return item;
}