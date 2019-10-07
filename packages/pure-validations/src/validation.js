import Maybe from "@totalsoft/arcadia/data/maybe";
import List from "@totalsoft/arcadia/data/list";
import RoseTree from "@totalsoft/arcadia/data/roseTree";
import { chain, map, id, constant } from "@totalsoft/arcadia";
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
