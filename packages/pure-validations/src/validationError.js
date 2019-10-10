import List from "@totalsoft/zion/data/list";
import Maybe from "@totalsoft/zion/data/maybe";
import Map from "@totalsoft/zion/data/map";
import ObjectTree from "@totalsoft/zion/data/objectTree";
import { curry } from "ramda";

const { Just, Nothing } = Maybe;

function ValidationError(errors, fields = {}) {
  const maybeError =
    Array.isArray(errors) && errors.length > 0 ? Just(List.fromArray(errors)) : typeof errors === "string" ? Just(List.fromArray([errors])) : Nothing;

  const fieldsMap = Map.fromObj(fields);

  return ObjectTree(maybeError, fieldsMap);
}

ValidationError.getField = ObjectTree.getChildAt;

ValidationError.moveToField = curry(function moveToField(field, error) {
  return ValidationError([], { [field]: error });
});

export default ValidationError;
