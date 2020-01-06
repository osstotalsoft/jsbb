import { useState, useCallback, useMemo } from 'react';
import * as di from '../dirtyInfo'
import { logTo, applyRule, ensureArrayUIDsDeep, setInnerProp } from '@totalsoft/pure-rules'

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
            const changedModel = setInnerProp(model, propertyPath, value)
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

