import Maybe from "@totalsoft/zion/data/maybe";
import List from "@totalsoft/zion/data/list";
import ObjectTree from "@totalsoft/zion/data/objectTree";
import ValidationError from "./validationError";
import { chain, map, identity, always, curry } from "ramda";

const Success = Maybe.Nothing;
const Failure = Maybe.Just;

function isValid(validation) {
  return Maybe.Nothing.is(validation);
}

function getErrors(validation) {
  const maybeArray = validation |> chain(ObjectTree.getValue) |> map(List.toArray);
  const result = maybeArray.cata({
    Just: identity,
    Nothing: always([])
  });
  return result;
}

const getInner = curry(function getInner(path, validation) {
  return path.reduce((acc, key) => chain(ValidationError.getField(key), acc), validation);
});

export { Success, Failure, isValid, getErrors, getInner };
