import { Success, isValid as pureIsValid, getErrors as pureGetErrors, getInner } from '@totalsoft/pure-validations';

const isValidPropSymbol = Symbol("isValid")
const errorsPropSymbol = Symbol("errors")
const errorSeparatorSymbol = Symbol("errorSeparator")
const defaultErrorSeparator = ", "

const handler = {
    get: function (target, name) {
        if (name in target) {
            return target[name];
        }

        switch (name) {
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

const successProxy = new Proxy(Success, handler)

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