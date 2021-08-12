// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Success, isValid as pureIsValid, getErrors as pureGetErrors, getInner } from '@totalsoft/pure-validations';

const isValidPropSymbol = Symbol("isValid")
const errorsPropSymbol = Symbol("errors")
const errorSeparatorSymbol = Symbol("errorSeparator")
const targetSymbol = Symbol("target")
const defaultErrorSeparator = ", "

const handler = {
    get: function (target, name) {
        if (name in target) {
            return target[name]
        }

        switch (name) {
            case targetSymbol: {
                return target
            }

            case isValidPropSymbol: {
                const valid = pureIsValid(target)
                target[isValidPropSymbol] = valid; // cache value
                return valid
            }
            case errorsPropSymbol: {
                const errors = pureGetErrors(target).join(target[errorSeparatorSymbol] || defaultErrorSeparator)
                target[errorsPropSymbol] = errors; // cache value
                return errors
            }
            default: {
                const proxy = ValidationProxy(getInner([name], target))
                target[name] = proxy; // cache value
                return proxy
            }
        }
    }
}

const successProxy = initializeSuccessProxy()

function initializeSuccessProxy() {
    const proxy = new Proxy(Success, handler)
    proxy[isValidPropSymbol]
    proxy[errorsPropSymbol]
    proxy[targetSymbol]
    return proxy;
}

export function eject(proxy) {
    return proxy[targetSymbol]
}

export function getErrors(proxy, separator) {
    proxy[errorSeparatorSymbol] = separator
    return proxy[errorsPropSymbol]
}

export function isValid(proxy) {
    return proxy[isValidPropSymbol]
}

export function ValidationProxy(validation) {
    return isValid(validation) ? successProxy : new Proxy(validation, handler)
}