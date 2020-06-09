import { useMemo, useState } from 'react';
import { LensProxy } from '../lensProxy'
import LensState from '../lensState';

export function useStateLens(initialModel, deps = []) {
    const [state, setState] = useState(initialModel)
    const lensProxy = useMemo(
        () => LensState(state, setState) |> LensProxy, 
        [...deps, state])

    return lensProxy
}