import Maybe from "./fantasy/data/maybe";
import List from "./fantasy/data/list";
import RoseTree from "./fantasy/data/roseTree";
import { chain, map, id, constant } from "./fantasy/prelude";
import ValidationError from "./validationError";
import curry from "lodash.curry";

const Success = Maybe.Nothing;
const Failure = Maybe.Just;

function isValid(validation) {
  return Maybe.Nothing.is(validation);
}

function getErrors(validation) {
  const maybeArray = validation |> chain(RoseTree.getValue) |> map(List.toArray);
  const result = maybeArray.cata({
    Just: id,
    Nothing: constant([])
  });
  return result;
}

const getInner = curry(function getInner(path, validation) {
  return path.reduce((acc, key) => chain(ValidationError.getField(key), acc), validation);
});

export { Success, Failure, isValid, getErrors, getInner };
