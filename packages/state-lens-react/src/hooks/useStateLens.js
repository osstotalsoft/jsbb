import { useMemo, useState } from 'react';
import { LensProxy } from '../lensProxy'
import ProfunctorState from '../profunctorState';

export function useStateLens(initialModel, deps = []) {
    const [state, setState] = useState(initialModel)
    const memoizedProfunctor = useMemo(() => ProfunctorState(state, setState), [...deps, state])
    const changeTrackingLensProxy = useMemo(() => LensProxy(memoizedProfunctor), [memoizedProfunctor])
    
    return changeTrackingLensProxy
}