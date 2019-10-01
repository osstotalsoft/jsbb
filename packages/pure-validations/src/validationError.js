import RoseTree from "./fantasy/data/roseTree";
import { Just, Nothing } from "./fantasy/data/maybe";
import KeyValuePair from "./fantasy/data/keyValuePair";
import Map from "./fantasy/data/map";

function ValidationError(errors, fields) {
  const value = errors && errors.length > 0 ? Just(errors) : Nothing;
  const children = Map.fromList(Object.entries(fields).map(([k, v]) => KeyValuePair(k, v)));
  return RoseTree(value, children);
}

export default ValidationError;
