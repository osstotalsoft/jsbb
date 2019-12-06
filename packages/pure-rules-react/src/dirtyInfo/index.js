import get from 'lodash.get';
import { findMatchingItem } from '@totalsoft/pure-rules';

export function create(isDirty = false) {
    return { isDirty };
}

export function update(propertyPath, propertyDirtyInfo, dirtyInfo) {
    const path = Array.isArray(propertyPath) ? propertyPath : propertyPath.split(".");

    const [property, ...rest] = path;
    const innerDirtyInfo = dirtyInfo[property] || create();
    const innerPropDirtyInfo = rest.length === 0 ? propertyDirtyInfo : update(rest, propertyDirtyInfo, innerDirtyInfo)

    return updateSingleProperty(property, innerPropDirtyInfo, dirtyInfo);
}

export function merge(sourceDirtyInfo, targetDirtyInfo) {
    if (sourceDirtyInfo === targetDirtyInfo || sourceDirtyInfo === null || sourceDirtyInfo === undefined) {
        return targetDirtyInfo;
    }

    if (targetDirtyInfo === null || targetDirtyInfo === undefined) {
        return sourceDirtyInfo;
    }

    if (typeof sourceDirtyInfo === "boolean") {
        return sourceDirtyInfo;
    }

    const result = Object.keys(sourceDirtyInfo)
        .filter(x => x !== "isDirty")
        .reduce(
            (accumulator, property) => updateSingleProperty(property, merge(sourceDirtyInfo[property], targetDirtyInfo[property]), accumulator),
            targetDirtyInfo
        );
    return result;
}

export function detectChanges(model, prevModel, prevDirtyInfo = create()) {
    if (typeof (model) !== "object" || typeof (prevModel) !== "object") {
        return model !== prevModel
    }

    if (Array.isArray(model)) {
        return detectChangesArray(model, prevModel, prevDirtyInfo)
    }

    const diAfterUpdates = Object.keys(model)
        .filter(k => k in prevModel && model[k] !== prevModel[k])
        .reduce((acc, prop) =>
            updateSingleProperty(prop, detectChanges(model[prop], prevModel[prop], prevDirtyInfo[prop]), acc),
            prevDirtyInfo)

    const diAfterDeletions = Object.keys(prevModel)
        .filter(k => !(k in model))
        .reduce((acc, prop) =>
            updateSingleProperty(prop, false, acc),
            diAfterUpdates)

    return diAfterDeletions;
}

function detectChangesArray(model, prevModel, prevDirtyInfo) {

    // const modelMap = toMap(model);
    // const prevModelMap = toMap(prevModel);

    // const diAfterUpdatesOrReorder = Object.keys(model)
    //     .map(k => [modelMap[k], prevModelMap[k]])
    //     .filter(([item, matchingItem]) => atchingItem !== undefined)
    //     .filter(([[itemValue, itemIdex], [matchingItemValue, matchingItemIndex]]) => itemValue !== matchingItemValue || itemIndex !== matchingItemIndex)
    //     .reduce((acc, [[itemValue, itemIdex], [matchingItemValue, matchingItemIndex]]) => {
    //         return itemIndex !== matchingItemIndex ? updateSingleProperty(itemIdex, detectChanges(itemValue, matchingItemValue, prevDirtyInfo[itemIdex]), acc)
    //     }
    //         ,
    //         prevDirtyInfo)



    const diAfterUpdates = Object.keys(model)
        .map(k => [model[k], findMatchingItem(model[k], k, prevModel), k])
        .filter(([item, matchingItem]) => (matchingItem !== undefined && item != matchingItem))
        .reduce((acc, [item, matchingItem, index]) =>
            updateSingleProperty(index, detectChanges(item, matchingItem, prevDirtyInfo[index]), acc),
            prevDirtyInfo)


    const diAfterDeletions = Object.keys(prevModel)
        .filter(index => findMatchingItem(prevModel[index], index, model) === undefined)
        .reduce((acc, index) =>
            updateSingleProperty(index, false, acc),
            diAfterUpdates)

    return diAfterDeletions;
}

export function isPropertyDirty(propertyPath, dirtyInfo) {
    return getIsDirty(get(dirtyInfo, propertyPath));
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
            isDirty: reduceIsDirty(result)
        }
        : result;
}

function reduceIsDirty(dirtyInfo) {
    const isDirty = Object.keys(dirtyInfo).filter(x => x !== "isDirty").some(x => getIsDirty(dirtyInfo[x]));
    return isDirty;
}

function getIsDirty(dirtyInfo) {
    return typeof dirtyInfo === "boolean"
        ? dirtyInfo
        : dirtyInfo && dirtyInfo.isDirty;
}