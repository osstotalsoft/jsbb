import { Just, Nothing } from "./maybe";
import { ValidationError } from "./validationError";

function Success() {
  return Nothing();
}

function Failure(errors, fields) {
  return Just(ValidationError(errors, fields));
}

function match(validation, { Success, Failure }) {
  return validation.isNothing ? Success() : Failure(validation.value);
}

function isValid(validation) {
  return match(validation, { Success: () => true, Failure: _ => false });
}

export const Validation = { Success, Failure, isValid };
