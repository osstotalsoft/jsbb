import { Just, Nothing } from "./maybe";
import { ValidationError } from "./validationError";

function Success() {
  return Nothing();
}

function Failure(errors, fields) {
  return Just(ValidationError(errors, fields));
}

function isValid(validation) {
  return validation.isNothing;
}

function getErrors(validation) {
  return isValid(validation) ? [] : validation.value.getErrors()
}

function getInner(validation, path) {
  if (isValid(validation))
    return validation;

  return path.reduce((acc, key) => (!isValid(acc) && acc.value.getField(key)) || Success(), validation)
}

export const Validation = { Success, Failure, isValid, getErrors, getInner };
