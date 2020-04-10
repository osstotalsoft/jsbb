import { useProfunctorState } from '@staltz/use-profunctor-state'
import { useMemo, useCallback, useState } from 'react';
import { create, detectChanges, ensureArrayUIDsDeep} from '@totalsoft/change-tracking'
import { LensProxy } from '@totalsoft/change-tracking-react'


export function useChangeTrackingLens(initialModel) {
    const [dirtyInfo, setDirtyInfo] = useState(create)
    const profunctor = useProfunctorState(ensureArrayUIDsDeep(initialModel));

    const changeTrackingProfunctor = profunctor.promap(
        model => model,
        (changedModel, prevModel) => {
            const newModel = ensureArrayUIDsDeep(changedModel)
            const newDirtyInfo = detectChanges(newModel, prevModel, dirtyInfo)
            setDirtyInfo(newDirtyInfo)
            return newModel;
        },
        [profunctor.state],
    )

    const changeTrackingLensProxy = useMemo(() => LensProxy(changeTrackingProfunctor), [changeTrackingProfunctor]);

    return [
        changeTrackingLensProxy,
        dirtyInfo,

        // Reset
        useCallback((newModel = undefined) => {
            setDirtyInfo(create())
            if (newModel !== undefined) {
                profunctor.setState(ensureArrayUIDsDeep(newModel));
            }
        }, [])
    ]
}