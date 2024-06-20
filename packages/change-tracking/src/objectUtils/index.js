// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { curry } from "ramda";

export const setInnerProp = curry(function setInnerProp(obj, path, value) {
    function inner(obj, searchKeyPath) {
        const [prop, ...rest] = searchKeyPath;
        if (prop == undefined) {
            return value
        }
        const newValue = rest.length > 0 ? inner(obj[prop], rest) : value
        return _immutableAssign(obj, prop, newValue);
    }

    if (typeof path === "string") {
        path = path.split(".")
    }

    return inner(obj, path);
});

export const getInnerProp = curry(function getInnerProp(obj, searchKeyPath = []) {
    const [prop, ...rest] = searchKeyPath;
    return prop !== undefined ? getInnerProp(obj[prop], rest) : obj;
});


function _immutableAssign(obj, prop, value) {
    if (obj[prop] === value) {
        return obj;
    }

    return Array.isArray(obj)
        ? Object.assign([], obj, { [prop]: value })
        : { ...obj, [prop]: value }
}

export function defaultVal(type) {
    if (typeof type !== 'string') throw new TypeError('Type must be a string.');
    
    // Handle simple types (primitives and plain function/object)
    switch (type) {
        // eslint-disable-next-line no-undef
        case 'bigint'    : return BigInt(0);
        case 'boolean'   : return false;
        case 'function'  : return function () {};
        case 'null'      : return null;
        case 'number'    : return 0;
        case 'object'    : return {};
        case 'string'    : return "";
        case 'symbol'    : return Symbol();
        case 'undefined' : return void 0;
    }
    
    try {
        // Look for constructor in this or current scope
        var ctor = typeof this[type] === 'function'
                   ? this[type]
                   : eval(type);
        
        return new ctor;
    
    // Constructor not found, return new object
    } catch (e) { return {}; }
}