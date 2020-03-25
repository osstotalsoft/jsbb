import { useProfunctorState } from '@staltz/use-profunctor-state'
import { RulesEngineProxy } from '../rulesProfunctorProxy';
import { useMemo, useCallback, useState } from 'react';
import { applyRule, logTo, ensureArrayUIDsDeep } from '@totalsoft/rules-algebra';
import * as di from '../dirtyInfo'


export function useRulesProfunctor(rules, initialModel, { isLogEnabled = true, logger = console } = {}, deps = []) {
    const [dirtyInfo, setDirtyInfo] = useState(di.create)
    
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
            setDirtyInfo(di.detectChanges(result, prevModel, dirtyInfo))
            return result;
        },
        [profunctor.state, rulesEngine],
    )

    const profunctoProxy = useMemo(() => RulesEngineProxy(rulesEngineProfunctor), [rulesEngineProfunctor]);

    return [
        profunctoProxy,
        dirtyInfo,

        // Reset
        useCallback((newModel) => {
            setDirtyInfo(di.create())
            profunctor.setState(ensureArrayUIDsDeep(newModel));
        }, [])
    ]
}