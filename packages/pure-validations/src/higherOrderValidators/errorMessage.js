import { checkValidators } from "./_utils";
import { curry, map } from "ramda"
import ValidationError from "../validationError";
import i18next from "i18next";

function tryTranslate(error) {
  if (typeof error === 'string') {
    return i18next.t(error) || error
  }

  if (Array.isArray(error)) {
    return error.map(tryTranslate)
  }

  return error
}

const errorMessage = curry(function logTo(error, validator) {
  checkValidators(validator);
  return validator |> map(map(_ => ValidationError(tryTranslate(error))))
});

export default errorMessage;
