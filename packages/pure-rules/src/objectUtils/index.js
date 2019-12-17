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
        ? Object.assign([...obj], { [prop]: value })
        : { ...obj, [prop]: value }
}