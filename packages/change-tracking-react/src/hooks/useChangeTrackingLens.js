// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { useStateLens, rmap, over, reuseCache } from '@totalsoft/react-state-lens'
import { useCallback, useState, useMemo, useRef } from 'react';
import { create, detectChanges, ensureArrayUIDsDeep } from '@totalsoft/change-tracking'

export function useChangeTrackingLens(initialModel) {
    const [dirtyInfo, setDirtyInfo] = useState(create)
    const stateLens = useStateLens(() => ensureArrayUIDsDeep(initialModel));
    const prevProxy = useRef(null);
    const changeTrackingLens = useMemo(() => {
            const proxy = stateLens |> rmap(
                (changedModel, prevModel) => {
                    const newModel = ensureArrayUIDsDeep(changedModel)
                    setDirtyInfo(dirtyInfo => detectChanges(newModel, prevModel, dirtyInfo));
                    return newModel;
                })

            if (prevProxy.current) {
                reuseCache(prevProxy.current, proxy)
            }
            prevProxy.current = proxy;
            return proxy
        },
        [stateLens])

    return [
        changeTrackingLens,
        dirtyInfo,

        // Reset
        useCallback((newModel = undefined) => {
            over(stateLens, (prevModel => {
                setDirtyInfo(create())
                return newModel !== undefined ? ensureArrayUIDsDeep(newModel) : prevModel
            }));
        }, [])
    ]
}