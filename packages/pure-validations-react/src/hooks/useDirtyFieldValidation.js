import { useState, useCallback } from 'react';
import { useValidation } from './useValidation'
import { dirtyInfo as di } from '../dirtyInfo';

export function useDirtyFieldValidation(rules, dirtyInfo, options = {}, deps = []) {
    const [dirtyOnly, setDirtyOnly] = useState(true)

    const isDirtyFilter = useCallback((context) => {
        if (!context.dirtyInfo) {
            return true
        }

        return di.isPropertyDirty(context.fieldPath.join("."), context.dirtyInfo) ? true : false
    }, [])

    const [validation, validate, reset] =
        useValidation(rules, {
            ...options,
            fieldFilterFunc: isDirtyFilter
        }, [...deps])


    return [
        validation,

        // Validate
        useCallback((model, dirtyInfo) => {
            if (!dirtyInfo) {
                setDirtyOnly(false)
            }
            return validate(model, { dirtyInfo: dirtyOnly && dirtyInfo })
        }, [validate, dirtyOnly]),

        // Reset
        useCallback(() => {
            setDirtyOnly(true)
            reset()
        }, [reset])
    ]
}