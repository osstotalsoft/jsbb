import { useStateLens, rmap, over } from '@totalsoft/state-lens-react'
import { useCallback, useState, useMemo } from 'react';
import { create, detectChanges, ensureArrayUIDsDeep } from '@totalsoft/change-tracking'

export function useChangeTrackingLens(initialModel) {
    const [dirtyInfo, setDirtyInfo] = useState(create)
    const profunctor = useStateLens(() => ensureArrayUIDsDeep(initialModel));
    const changeTrackingLens = useMemo(() =>
        profunctor |> rmap(
            (changedModel, prevModel) => {
                const newModel = ensureArrayUIDsDeep(changedModel)
                const newDirtyInfo = detectChanges(newModel, prevModel, dirtyInfo)
                setDirtyInfo(newDirtyInfo)
                return newModel;
            }),
        [profunctor])

    return [
        changeTrackingLens,
        dirtyInfo,

        // Reset
        useCallback((newModel = undefined) => {
            over(profunctor, (prevModel => {
                setDirtyInfo(create())
                return newModel !== undefined ? ensureArrayUIDsDeep(newModel) : prevModel
            }));
        }, [])
    ]
}