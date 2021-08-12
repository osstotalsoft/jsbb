// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Success, validate, logTo, filterFields } from '@totalsoft/pure-validations';
import { ValidationProxy, isValid } from '../validationProxy';
import { useTranslation } from 'react-i18next';


export function useValidation(rules, { isLogEnabled = true, logger = console, fieldFilterFunc = undefined } = {}, deps = []) {
    const [validation, setValidation] = useState(ValidationProxy(Success));
    const [, i18n] = useTranslation()
    const [state, setState] = useState({})

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

    useEffect(() => {
        if (isValid(validation)) {
            return
        }
        const validationProxy = ValidationProxy(validate(validator, state.model, state.context));
        setValidation((validationProxy));
    }, [i18n.language])

    return [
        validation,

        // Validate
        useCallback((model, context) => {
            const validation = ValidationProxy(validate(validator, model, context));
            setState({ model, context })
            setValidation((validation));
            return isValid(validation);
        }, [validator]),

        // Reset
        useCallback(() => {
            setValidation(ValidationProxy(Success))
            setState({})
        }, [])
    ]
}