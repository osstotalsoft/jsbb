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

function getInner(validation, path) {
  if (isValid(validation))
    return validation;

  return path.reduce((acc, key) => acc === undefined ? Success() : acc.value.getField(key), validation)
}

export const Validation = { Success, Failure, isValid, getInner };
