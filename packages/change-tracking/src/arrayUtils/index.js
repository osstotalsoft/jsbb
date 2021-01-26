import uniqid from "uniqid"
import { find, reduce, addIndex } from "ramda";

const uniqueIdSymbol = Symbol("uid");

const reduceIndexed = addIndex(reduce)

export function ensureArrayUIDsDeep(model) {
    if (typeof (model) !== "object" || model === null)
        return model;

    model = ensureArrayUIDs(model);

    const newModel = Object.entries(model)
        .reduce((acc, [k, v]) => { acc[k] = ensureArrayUIDsDeep(v); return acc; }, {})

    const hasSameProps = Object.entries(newModel).every(([k, v]) => v === model[k])
    return hasSameProps ? model : newModel;
}

export function ensureArrayUIDs(array) {
    if (!Array.isArray(array)) {
        return array;
    }

    const newArray = array.map(_ensureUniqueId)
    const hasSameElements = newArray.every((value, index) => value === array[index])
    return hasSameElements ? array : newArray
}

export function findMatchingItem(currentItem, currentIndex, otherArray) {
    if (!Array.isArray(otherArray)) {
        return undefined;
    }

    return typeof (currentItem) === "object" && uniqueIdSymbol in currentItem
        ? otherArray |> find(prevItem => prevItem[uniqueIdSymbol] === currentItem[uniqueIdSymbol])
        : otherArray[currentIndex];
}

export function hasSameItemOrder(firstArray, secondArray) {
    if (!Array.isArray(firstArray) || !Array.isArray(secondArray) || firstArray.length !== secondArray.length) {
        return false;
    }

    return firstArray |> reduceIndexed((acc, firstValue, index) => {
        const secondValue = secondArray[index];
        const firstUidOrValue = (firstValue && firstValue[uniqueIdSymbol]) || firstValue;
        const secondUidOrValue = (secondValue && secondValue[uniqueIdSymbol]) || secondValue;
        return acc && firstUidOrValue === secondUidOrValue
    }, true)
}

export function toUniqueIdMap(array) {
    if (!Array.isArray(array) || array.length === 0) {
        return {};
    }

    return array |> reduceIndexed((acc, value, index) => {
        acc[(value && value[uniqueIdSymbol]) || index] = { value, index }
        return acc;
    }, {})
}

function _ensureUniqueId(item) {
    if (typeof (item) === "object" && item[uniqueIdSymbol] === undefined) {
        return {...item, [uniqueIdSymbol]: uniqid()}
    }
    return item;
}