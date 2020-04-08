import { useState, useCallback } from 'react';
import { useValidation } from './'
import { isPropertyDirty } from '@totalsoft/change-tracking'

export function useDirtyFieldValidation(rules, options = {}, deps = []) {
    const [dirtyOnly, setDirtyOnly] = useState(true)

    const isDirtyFilter = useCallback((context) => {
        if (!context.dirtyInfo) {
            return true
        }

        return isPropertyDirty(context.fieldPath.join("."), context.dirtyInfo) ? true : false
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
            return validate(model, { dirtyInfo: dirtyOnly ? dirtyInfo : undefined })
        }, [validate, dirtyOnly]),

        // Reset
        useCallback(() => {
            setDirtyOnly(true)
            reset()
        }, [reset])
    ]
}