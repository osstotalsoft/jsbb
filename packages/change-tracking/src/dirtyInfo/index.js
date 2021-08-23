// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import get from 'lodash.get';
import { toUniqueIdMap, hasSameItemOrder } from '../arrayUtils';
import { curry } from "ramda";

const isDirtySymbol = Symbol("isDirty");

export function create(isDirty = false) {
    return { [isDirtySymbol]: isDirty };
}

export const update = curry(function update(propertyPath, propertyDirtyInfo, dirtyInfo) {
    const path = Array.isArray(propertyPath) ? propertyPath : propertyPath.split(".");

    const [property, ...rest] = path;
    const innerDirtyInfo = dirtyInfo[property] || create();
    const innerPropDirtyInfo = rest.length === 0 ? propertyDirtyInfo : update(rest, propertyDirtyInfo, innerDirtyInfo)

    return updateSingleProperty(property, innerPropDirtyInfo, dirtyInfo);
})

export const merge = curry(function merge(sourceDirtyInfo, targetDirtyInfo) {
    if (sourceDirtyInfo === targetDirtyInfo || sourceDirtyInfo === null || sourceDirtyInfo === undefined) {
        return targetDirtyInfo;
    }

    if (targetDirtyInfo === null || targetDirtyInfo === undefined) {
        return sourceDirtyInfo;
    }

    if (typeof sourceDirtyInfo === "boolean") {
        return sourceDirtyInfo
    }

    const result = Object.keys(sourceDirtyInfo)
        .filter(x => x !== isDirtySymbol)
        .reduce(
            (accumulator, property) => updateSingleProperty(property, merge(sourceDirtyInfo[property], targetDirtyInfo[property]), accumulator),
            targetDirtyInfo
        );
    return result
})

export const detectChanges = curry(function detectChanges(model, prevModel, prevDirtyInfo = create()) {
    if (model === prevModel) {
        return false
    }

    // Both NaN
    if (model !== model && prevModel !== model) {
        return false;
    }

    if (!model || !prevModel) {
        return true
    }

    if (typeof model !== 'object' || typeof prevModel !== 'object') {
        return true;
    }
    
    if (model.constructor !== prevModel.constructor) {
        return true;
    }

    if (Array.isArray(model)) {
        return detectChangesArray(model, prevModel, prevDirtyInfo)
    }

    if (model.constructor === RegExp) {
        return model.source !== prevModel.source || model.flags !== prevModel.flags;
    }

    if (model.valueOf !== Object.prototype.valueOf) {
         return model.valueOf() !== prevModel.valueOf();
    }

    if (model.toString !== Object.prototype.toString) {
         return model.toString() !== prevModel.toString();
    }
     
    return detectChangesObject(model, prevModel, prevDirtyInfo)
})

export function isPropertyDirty(propertyPath, dirtyInfo) {
    return getIsDirty(get(dirtyInfo, propertyPath)) || false;
}

export function isDirty(dirtyInfo) {
    return getIsDirty(dirtyInfo) || false;
}

function detectChangesObject(model, prevModel, prevDirtyInfo) {
    const newDirtyInfo = Object.keys(model)
        .reduce((acc, prop) =>
            prop in prevModel
                ? (
                    model[prop] === prevModel[prop]
                        ? updateSingleProperty(prop, prevDirtyInfo[prop], acc)
                        : updateSingleProperty(prop, detectChanges(model[prop], prevModel[prop], prevDirtyInfo[prop]), acc)
                )
                : updateSingleProperty(prop, model[prop] !== undefined, acc),
            prevDirtyInfo)

    return Object.keys(model).length !== Object.keys(prevModel).length ? { ...newDirtyInfo, [isDirtySymbol]: true } : newDirtyInfo
}

function detectChangesArray(model, prevModel, prevDirtyInfo) {
    const modelMap = toUniqueIdMap(model);
    const prevModelMap = toUniqueIdMap(prevModel);

    const newDirtyInfo = Object.keys(modelMap)
        .reduce((acc, prop) =>
            prop in prevModelMap
                ? (
                    modelMap[prop].value === prevModelMap[prop].value
                        ? updateSingleProperty(modelMap[prop].index, prevDirtyInfo[prevModelMap[prop].index], acc)
                        : updateSingleProperty(modelMap[prop].index, detectChanges(modelMap[prop].value, prevModelMap[prop].value, prevDirtyInfo[prevModelMap[prop].index]), acc)
                )
                : updateSingleProperty(modelMap[prop].index, false, acc),
            prevDirtyInfo)

    return Object.keys(modelMap).length !== Object.keys(prevModelMap).length || !hasSameItemOrder(model, prevModel)
        ? { ...newDirtyInfo, [isDirtySymbol]: true }
        : newDirtyInfo
}

function updateSingleProperty(property, propertyDirtyInfo, dirtyInfo) {
    if (dirtyInfo[property] === propertyDirtyInfo) {
        return dirtyInfo;
    }

    let result = {
        ...dirtyInfo,
        [property]: propertyDirtyInfo,
    };

    const isDirtyChanged = getIsDirty(dirtyInfo[property]) !== getIsDirty(propertyDirtyInfo);
    return isDirtyChanged
        ? {
            ...result,
            [isDirtySymbol]: reduceIsDirty(result)
        }
        : result;
}

function reduceIsDirty(dirtyInfo) {
    const isDirty = Object.keys(dirtyInfo).filter(x => x !== isDirtySymbol).some(x => getIsDirty(dirtyInfo[x]));
    return isDirty;
}

function getIsDirty(dirtyInfo) {
    return typeof dirtyInfo === "boolean"
        ? dirtyInfo
        : dirtyInfo && dirtyInfo[isDirtySymbol];
}