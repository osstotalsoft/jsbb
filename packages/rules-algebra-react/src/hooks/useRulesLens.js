import { useStateLens, rmap, over } from '@totalsoft/state-lens-react'
import { useMemo, useCallback, useState } from 'react';
import { applyRule, logTo } from '@totalsoft/rules-algebra';
import { create, detectChanges, ensureArrayUIDsDeep } from '@totalsoft/change-tracking'

export function useRulesLens(rules, initialModel, { isLogEnabled = true, logger = console } = {}, deps = []) {
    const [dirtyInfo, setDirtyInfo] = useState(create)
    
    const rulesEngine = useMemo(() => {
        let newRules = rules;

        if (isLogEnabled) {
            newRules = logTo(logger)(newRules)
        }

        return newRules
    }, [rules, isLogEnabled, logger, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

    const lensState = useStateLens(() => ensureArrayUIDsDeep(initialModel));

    const rulesEngineLens = useMemo(() =>
        lensState |> rmap(
            (changedModel, prevModel) => {
                const result = applyRule(rulesEngine, ensureArrayUIDsDeep(changedModel), prevModel)
                setDirtyInfo(detectChanges(result, prevModel, dirtyInfo))
                return result;
            }),
        [lensState, rulesEngine])

   
    return [
        rulesEngineLens,
        dirtyInfo,

        // Reset
        useCallback((newModel = undefined) => {
            over(lensState, (prevModel => {
                setDirtyInfo(create())
                return newModel !== undefined ? ensureArrayUIDsDeep(newModel) : prevModel
            }));
        }, [])
    ]
}