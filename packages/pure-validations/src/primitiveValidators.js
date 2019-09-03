// @flow
import { Validation } from "./validation";
import i18next from "i18next";
import type { ValidationType } from "./validation";

type Validator<TModel> = (model: TModel) => ValidationType;

const defaultMessages = {
  "Validations.Generic.Mandatory": "The value is mandatory",
  "Validations.Generic.Regex": "The value has an invalid format",
  "Validations.Generic.Email": "The value is not a valid email address",
  "Validations.Generic.OutOfRange": "The value must be between {{min}} and {{max}}",
  "Validations.Generic.Greater": "The value must be greater than {{min}}",
  "Validations.Generic.Less": "The value must be less than {{max}}",
  "Validations.Generic.MaxCharacters": "The length must be less than {{max}}",
  "Validations.Generic.MinCharacters": "The length must be greater than {{min}}",
  "Validations.Generic.Unique": "The value of {{selector}} must be unique"
};

function translate(key, args) {
  return i18next.t(key, { defaultValue: defaultMessages[key], ...args }) || defaultMessages[key];
}

export function isMandatory<TModel>(x: TModel): ValidationType {
  return x !== null && x !== undefined && (typeof x === "string" ? x !== "" : true) && (Array.isArray(x) ? x.length : true)
    ? Validation.Success()
    : Validation.Failure([translate("Validations.Generic.Mandatory")]);
}

export function isEmail<TModel>(x: TModel): ValidationType {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(x).toLowerCase()) ? Validation.Success() : Validation.Failure([translate("Validations.Generic.Email")]);
}

export function matches<TModel>(regex: RegExp): Validator<TModel> {
  return function(x) {
    return regex.test(String(x)) ? Validation.Success() : Validation.Failure([translate("Validations.Generic.Regex")]);
  };
}

export function isInRange(min: number, max: number): Validator<?number> {
  return function(value) {
    return value === null || value === undefined || (value >= min && value <= max)
      ? Validation.Success()
      : Validation.Failure([translate("Validations.Generic.OutOfRange", { min, max })]);
  };
}

export function isGreaterThan(min: number): Validator<?number> {
  return function(value) {
    return value === null || value === undefined || value > min
      ? Validation.Success()
      : Validation.Failure([translate("Validations.Generic.Greater", { min })]);
  };
}

export function isLessThan(max: number): Validator<?number> {
  return function(value) {
    return value === null || value === undefined || value < max
      ? Validation.Success()
      : Validation.Failure([translate("Validations.Generic.Less", { max })]);
  };
}

export function hasLengthGreaterThan(min: number): Validator<?string> {
  return function(value) {
    return value === null || value === undefined || value.length > min
      ? Validation.Success()
      : Validation.Failure([translate("Validations.Generic.MinCharacters", { min })]);
  };
}

export function hasLengthLessThan(max: number): Validator<?string> {
  return function(value) {
    return value === null || value === undefined || value.length < max
      ? Validation.Success()
      : Validation.Failure([translate("Validations.Generic.MaxCharacters", { max })]);
  };
}

export function isUnique<TItem>(selector: void | string | string[] | (any => any)): Validator<TItem[]> {
  return function(list) {
    let selectorFn: TItem => mixed;

    function buildSelectorFn(propArray) {
      return x => propArray.reduce((acc: any, prop) => acc[prop], x);
    }

    if (!selector) {
      selectorFn = x => x;
    } else if (typeof selector === "string") {
      selectorFn = buildSelectorFn(selector.split("."));
    } else if (selector instanceof Array) {
      selectorFn = buildSelectorFn(selector);
    } else if (typeof selector === "function") {
      selectorFn = selector;
    } else {
      throw "Invalid selector"; // TBD
    }

    return [...new Set(list.map(selectorFn))].length === list.length
      ? Validation.Success()
      : Validation.Failure([translate("Validations.Generic.Unique", { selector: selector ? selector.toString() : "" })]);
  };
}
