// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { useState, useCallback } from 'react';
import { create, update } from '@totalsoft/change-tracking';

export function useDirtyInfo() {
    const [dirtyInfo, setDirtyInfo] = useState(create)

    return [
        dirtyInfo,

        // Set dirty path
        useCallback((propertyPath) => {
            setDirtyInfo(prevDirtyInfo => update(propertyPath, true, prevDirtyInfo))
        }, []),

        // Reset
        useCallback(() => {
            setDirtyInfo(create())
        }, [])
    ]
}

