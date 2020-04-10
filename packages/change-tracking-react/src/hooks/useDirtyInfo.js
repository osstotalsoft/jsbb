import { useState, useCallback } from 'react';
import { create, update } from '@totalsoft/change-tracking';

export function useDirtyInfo() {
    const [dirtyInfo, setDirtyInfo] = useState(create)

    return [
        dirtyInfo,

        // Set dirty path
        useCallback((propertyPath) => {
            const newDirtyInfo = update(propertyPath, true, dirtyInfo);
            setDirtyInfo(newDirtyInfo)
        }, [dirtyInfo]),

        // Reset
        useCallback(() => {
            setDirtyInfo(create())
        }, [])
    ]
}

