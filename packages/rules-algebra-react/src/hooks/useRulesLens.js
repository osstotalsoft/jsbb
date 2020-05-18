import { useProfunctorState } from '@staltz/use-profunctor-state'
import { LensProxy } from '@totalsoft/change-tracking-react/lensProxy';
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

    const profunctor = useProfunctorState(ensureArrayUIDsDeep(initialModel));

    const rulesEngineProfunctor = profunctor.promap(
        model => model,
        (changedModel, prevModel) => {
            const result = applyRule(rulesEngine, ensureArrayUIDsDeep(changedModel), prevModel)
            setDirtyInfo(detectChanges(result, prevModel, dirtyInfo))
            return result;
        },
        [profunctor.state, rulesEngine],
    )

    const lens = useMemo(() => LensProxy(rulesEngineProfunctor), [rulesEngineProfunctor]);

    return [
        lens,
        dirtyInfo,

        // Reset
        useCallback((newModel = undefined) => {
            profunctor.setState(prevModel => {
                setDirtyInfo(create())
                return newModel !== undefined ? ensureArrayUIDsDeep(newModel) : prevModel
            });
        }, [])
    ]
}