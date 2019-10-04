import List from "@totalsoft/arcadia/lib/data/list";
import Maybe from "@totalsoft/arcadia/lib/data/maybe";
import Map from "@totalsoft/arcadia/lib/data/map";
import RoseTree from "@totalsoft/arcadia/lib/data/roseTree";
import curry from "lodash.curry";

const { Just, Nothing } = Maybe;

function ValidationError(errors, fields = {}) {
  const maybeError =
    Array.isArray(errors) && errors.length > 0 ? Just(List.fromArray(errors)) : typeof errors === "string" ? Just(List.fromArray([errors])) : Nothing;

  const fieldsMap = Map.fromObj(fields);

  return RoseTree(maybeError, fieldsMap);
}

ValidationError.getField = RoseTree.getChildAt;

ValidationError.moveToField = curry(function moveToField(field, error) {
  return ValidationError([], { [field]: error });
});

export default ValidationError;
