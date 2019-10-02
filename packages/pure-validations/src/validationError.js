import RoseTree from "./fantasy/data/roseTree";
import Maybe from "./fantasy/data/maybe";
import Map from "./fantasy/data/map";
import List from "./fantasy/data/list";
import { empty } from "./fantasy/prelude";
import curry from "lodash.curry";

const { Just, Nothing } = Maybe;

function ValidationError(errors, fields) {
  const value = errors && errors.length > 0 ? Just(List.fromArray(errors)) : Nothing;
  const children = (fields !== null && fields != undefined)
    ? Map(fields)
    : empty(Map);
  return RoseTree(value, children);
}

ValidationError.getField = RoseTree.getChildAt;

ValidationError.moveToField = curry(function moveToField(field, error) {
  return ValidationError([], { [field]: error });
});

export default ValidationError;
