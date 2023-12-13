// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { useStateLens, rmap, over, reuseCache } from '@totalsoft/react-state-lens'
import { useMemo, useCallback, useState, useRef } from 'react';
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

    const stateLens = useStateLens(() => ensureArrayUIDsDeep(initialModel));
    const prevProxy = useRef(null);
    const rulesEngineLens = useMemo(() => {
        const proxy = stateLens |> rmap(
            (changedModel, prevModel) => {
                const result = applyRule(rulesEngine, ensureArrayUIDsDeep(changedModel), prevModel)
                setDirtyInfo(prevDirtyInfo => detectChanges(result, prevModel, prevDirtyInfo))
                return result;
            })
        if (prevProxy.current) {
            reuseCache(prevProxy.current, proxy)
        }
        prevProxy.current = proxy;
        return proxy
    }, [stateLens, rulesEngine])

    return [
        rulesEngineLens,
        dirtyInfo,

        // Reset
        useCallback((newModel = undefined) => {
            setDirtyInfo(create())            
            over(stateLens, (prevModel => {
                return newModel !== undefined ? ensureArrayUIDsDeep(newModel) : prevModel
            }));            
        }, [])
    ]
}