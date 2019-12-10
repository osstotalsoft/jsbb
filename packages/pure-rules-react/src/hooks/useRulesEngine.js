import { useState, useCallback, useMemo } from 'react';
import * as di from '../dirtyInfo'
import { logTo, applyRule, ensureArrayUIDsDeep } from '@totalsoft/pure-rules'

export function useRulesEngine(rules, initialModel, { isLogEnabled = true, logger = console } = {}, deps = []) {
    const [dirtyInfo, setDirtyInfo] = useState(di.create)
    const [model, setModel] = useState(ensureArrayUIDsDeep(initialModel))

    const rulesEngine = useMemo(() => {
        let newRules = rules;

        if (isLogEnabled) {
            newRules = logTo(logger)(newRules)
        }

        return newRules
    }, [rules, isLogEnabled, logger, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

    return [
        model,

        dirtyInfo,

        // Update property
        useCallback((propertyPath, value) => {
            const changedModel = _setInnerProp(model, propertyPath, value)
            if (changedModel === model) {
                return model;
            }

            const result = applyRule(rulesEngine, ensureArrayUIDsDeep(changedModel), model)
            setDirtyInfo(di.detectChanges(result, model, dirtyInfo))
            setModel(result);
            return result;
        }, [model, rulesEngine]),

        // Reset
        useCallback((newModel) => {
            setDirtyInfo(di.create())
            setModel(ensureArrayUIDsDeep(newModel));
        }, [])
    ]
}


function _setInnerProp(obj, path, value) {
    function inner(obj, searchKeyPath) {
        const [prop, ...rest] = searchKeyPath;
        if (prop == undefined) {
            return obj
        }
        const newValue = rest.length > 0 ? inner(obj[prop], rest) : value
        return _immutableAssign(obj, prop, newValue);
    }

    const searchKeyPath = Array.isArray(path) ? path : path.split(".")
    return inner(obj, searchKeyPath);
}

function _immutableAssign(obj, prop, value) {
    if (obj[prop] === value) {
        return obj;
    }

    return Array.isArray(obj)
        ? Object.assign([...obj], { [prop]: value })
        : { ...obj, [prop]: value }
}