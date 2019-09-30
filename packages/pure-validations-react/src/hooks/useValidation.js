import { useState, useCallback, useMemo } from 'react';
import { Validation, validate, isValid, logTo, filterFields } from '@totalsoft/pure-validations';


export function useValidation(rules, { isLogEnabled = true, logger = console, fieldFilterFunc = undefined } = {}, deps = []) {
    const [validation, setValidation] = useState(Validation.Success());
    const validator = useMemo(() => {
        let newValidator = rules;

        if (isLogEnabled) {
            newValidator = logTo(logger)(newValidator)
        }

        if (fieldFilterFunc) {
            newValidator = filterFields(fieldFilterFunc)(newValidator)
        }

        return newValidator
    }, [rules, isLogEnabled, logger, fieldFilterFunc, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

    return [
        validation,

        // Validate
        useCallback((model, context) => {
            const validation = validate(validator, model, context);
            setValidation(validation);
            return isValid(validation);
        }, [validator]),

        // Reset
        useCallback(() => {
            setValidation(Validation.Success())
        }, [])
    ]
}