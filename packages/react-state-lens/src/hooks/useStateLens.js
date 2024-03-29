// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { useMemo, useRef, useState } from 'react';
import { LensProxy, reuseCache } from '../lensProxy'
import StateLens from '../stateLens';

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
}