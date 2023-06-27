// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { useEffect, useMemo, useRef, useState } from 'react';
import { LensProxy, reuseCache } from '../lensProxy'
import StateLens, {set} from '../stateLens';

export function useStateLens(initialModel, deps = []) {
    const [state, setState] = useState(initialModel)
    const prevProxy = useRef(null)
    
    const lensProxyMemoized = useMemo(
        () => { 
            const proxy = StateLens(state, setState) |> LensProxy 
            if (prevProxy.current) {
                reuseCache(prevProxy.current, proxy)
            }
            prevProxy.current = proxy;

            return proxy;
        }, 
        [state, ...deps])

    return lensProxyMemoized

    // useEffect(() => {})

    // const prevState = useRef(state)
    // const lensProxy = useRef(StateLens(state, setState) |> LensProxy)
    // if (state !== prevState.current) {
    //     set(lensProxy.current, state)
    //     prevState.current = state
    // } 

    // return lensProxy.current
}