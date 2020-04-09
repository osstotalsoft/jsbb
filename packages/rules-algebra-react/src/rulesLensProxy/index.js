import { LensProxy, getValue as getLensValue, setValue as setLensValue, overValue as overLensValue, eject as ejectLens } from "@totalsoft/change-tracking-react";
import { curry } from "ramda";

export function eject(proxy) {
    return ejectLens(proxy)
}

export function setValue(proxy, newValue = undefined) {
    return setLensValue(proxy, newValue)
}

export function getValue(proxy) {
    return getLensValue(proxy)
}

export const overValue = curry(function overValue(proxy, func) {
    return overLensValue(proxy, func);
})

export function RulesLensProxy(rulesLens) {
    return LensProxy(rulesLens)
}