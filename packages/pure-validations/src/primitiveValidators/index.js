// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Validator } from "../validator";
import { Success, Failure } from "../validation";
import ValidationError from "../validationError";

import i18next from "i18next";

const defaultMessages = {
  "Validations.Generic.Mandatory": "The value is mandatory",
  "Validations.Generic.AtLeastOne": "There should be at least one item.",
  "Validations.Generic.Regex": "The value has an invalid format",
  "Validations.Generic.Email": "The value is not a valid email address",
  "Validations.Generic.OutOfRange": "The value must be between {{min}} and {{max}}",
  "Validations.Generic.Greater": "The value must be greater than {{min}}",
  "Validations.Generic.Less": "The value must be less than {{max}}",
  "Validations.Generic.MaxCharacters": "The length must be less than {{max}}",
  "Validations.Generic.MinCharacters": "The length must be greater than {{min}}",
  "Validations.Generic.Unique": "The value of {{selector}} must be unique",
  "Validations.Generic.Integer": "The value must be an integer number",
  "Validations.Generic.Number": "The value must be a number",
};

function translate(key, args) {
  return i18next.t(key, { defaultValue: defaultMessages[key], ...args }) || defaultMessages[key];
}

export const required = Validator(function required(x) {
  return x !== null && x !== undefined && (typeof x === "string" ? x !== "" : true)
    ? Success
    : Failure(ValidationError(translate("Validations.Generic.Mandatory")));
});

export const atLeastOne = Validator(function atLeastOne(x) {
  return Array.isArray(x) && x.length ? Success : Failure(ValidationError(translate("Validations.Generic.AtLeastOne")));
});

export const email = Validator(function email(x) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(x).toLowerCase()) ? Success : Failure(ValidationError(translate("Validations.Generic.Email")));
});

export function matches(regex) {
  return Validator(function matches(x) {
    return regex.test(String(x)) ? Success : Failure(ValidationError(translate("Validations.Generic.Regex")));
  });
}

export function between(min, max) {
  return Validator(function between(value) {
    return value === null || value === undefined || (value >= min && value <= max)
      ? Success
      : Failure(ValidationError(translate("Validations.Generic.OutOfRange", { min, max })));
  });
}

export function greaterThan(min) {
  return Validator(function greaterThan(value) {
    return value === null || value === undefined || value > min
      ? Success
      : Failure(ValidationError(translate("Validations.Generic.Greater", { min })));
  });
}

export function lessThan(max) {
  return Validator(function lessThan(value) {
    return value === null || value === undefined || value < max ? Success : Failure(ValidationError(translate("Validations.Generic.Less", { max })));
  });
}

export function minLength(min) {
  return Validator(function minLength(value) {
    return value === null || value === undefined || value.length > min
      ? Success
      : Failure(ValidationError(translate("Validations.Generic.MinCharacters", { min })));
  });
}

export function maxLength(max) {
  return Validator(function maxLength(value) {
    return value === null || value === undefined || value.length < max
      ? Success
      : Failure(ValidationError(translate("Validations.Generic.MaxCharacters", { max })));
  });
}

export const isInteger = Validator(function isInteger(value) {
    return Number.isInteger(value)
      ? Success
      : Failure(ValidationError(translate("Validations.Generic.Integer")));
  });

export const isNumber = Validator(function isNumber(value) {
  return typeof(value) === "number" && !Number.isNaN(value) && Number.isFinite(value)
    ? Success
    : Failure(ValidationError(translate("Validations.Generic.Number")));
});

export const valid = Validator.of(Success)

export function unique(selector, displayName = null) {
  return Validator(function unique(list) {
    if (list === null || list === undefined) {
      return Success;
    }

    let selectorFn;

    function buildSelectorFn(propArray) {
      return x => propArray.reduce((acc, prop) => acc[prop], x);
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

    const fieldName = displayName ? i18next.t(displayName) || displayName : selector ? selector.toString() : "";

    return [...new Set(list.map(selectorFn))].length === list.length
      ? Success
      : Failure(ValidationError(translate("Validations.Generic.Unique", { selector: fieldName })));
  });
}
