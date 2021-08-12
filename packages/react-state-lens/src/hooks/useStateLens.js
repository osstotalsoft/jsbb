// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { useMemo, useState } from 'react';
import { LensProxy } from '../lensProxy'
import StateLens from '../stateLens';

export function useStateLens(initialModel, deps = []) {
    const [state, setState] = useState(initialModel)
    const lensProxy = useMemo(
        () => StateLens(state, setState) |> LensProxy, 
        [...deps, state])

    return lensProxy
}