import { useMemo, useState } from 'react';
import { LensProxy } from '../lensProxy'
import LensState from '../lensState';

export function useStateLens(initialModel, deps = []) {
    const [state, setState] = useState(initialModel)
    const memoizedLensState = useMemo(() => LensState(state, setState), [...deps, state])
    const changeTrackingLensProxy = useMemo(() => LensProxy(memoizedLensState), [memoizedLensState])

    return changeTrackingLensProxy
}