import get from 'lodash.get';
import { toMap } from '@totalsoft/pure-rules';

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
    if (typeof (model) !== "object" || typeof (prevModel) !== "object" || model === null || prevModel === null) {
        return model !== prevModel
    }

    if (Array.isArray(model)) {
        return detectChangesArray(model, prevModel, prevDirtyInfo)
    }

    const newDirtyInfo = Object.keys(model)
        .reduce((acc, prop) =>
            prop in prevModel
                ? (
                    model[prop] === prevModel[prop]
                        ? updateSingleProperty(prop, prevDirtyInfo[prop], acc)
                        : updateSingleProperty(prop, detectChanges(model[prop], prevModel[prop], prevDirtyInfo[prop]), acc)
                )
                : updateSingleProperty(prop, false, acc),
            prevDirtyInfo)


    return Object.keys(model).length !== Object.keys(prevModel).length ? { ...newDirtyInfo } : newDirtyInfo
}

function detectChangesArray(model, prevModel, prevDirtyInfo) {
    const modelMap = toMap(model);
    const prevModelMap = toMap(prevModel);

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

    return Object.keys(modelMap).length !== Object.keys(prevModelMap).length ? { ...newDirtyInfo } : newDirtyInfo
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