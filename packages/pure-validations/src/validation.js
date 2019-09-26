import Maybe from "./fantasy/data/maybe";
import { ValidationError } from "./validationError";
import { chain } from "./fantasy/prelude";

function Success() {
  return Maybe.Nothing;
}

function Failure(errors, fields) {
  return Maybe.Just(ValidationError(errors, fields));
}

function isValid(validation) {
  return Maybe.Nothing.is(validation);
}

function getErrors(validation) {
  return validation.cata({
    Just: x => x.errors,
    Nothing: () => []
  });
}

function getInner(validation, path) {
  return path.reduce((acc, key) => acc |> chain(err => err.getField(key) || Maybe.Nothing), validation);
}

export const Validation = { Success, Failure, isValid, getErrors, getInner };
