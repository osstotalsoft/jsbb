import { useState, useCallback, useMemo } from 'react';
import { create, detectChanges, ensureArrayUIDsDeep, setInnerProp} from '@totalsoft/change-tracking'
import { logTo, applyRule } from '@totalsoft/rules-algebra'

export function useRules(rules, initialModel, { isLogEnabled = true, logger = console } = {}, deps = []) {
    const [dirtyInfo, setDirtyInfo] = useState(create)
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

        // Update model or property
        useCallback((value, propertyPath = undefined) => {
            const changedModel = propertyPath ? setInnerProp(model, propertyPath, value) : value
            if (changedModel === model) {
                return model;
            }

            const result = applyRule(rulesEngine, ensureArrayUIDsDeep(changedModel), model)
            setDirtyInfo(detectChanges(result, model, dirtyInfo))
            setModel(result);
            return result;
        }, [model, dirtyInfo, rulesEngine]),

        // Reset
        useCallback((newModel = undefined)  => {
            setDirtyInfo(create())
            if (newModel !== undefined) {
                setModel(ensureArrayUIDsDeep(newModel));
            }
        }, [])
    ]
}

