import { tagged } from "daggy";
import fl from "fantasy-land";
// import { $do, concat, map, reduce } from "../prelude";
// import { Just, Nothing } from "./maybe";
// import { Nil, Cons } from "./list";

const KeyValuePair = tagged("KeyValuePair", ["key", "value"]);

KeyValuePair.getKey = function getKey(x) {
  return x.key;
};

KeyValuePair.getValue = function getValue(x) {
  return x.value;
};

/* Functor RoseTree */
KeyValuePair.prototype[fl.map] = function(f) {
    return KeyValuePair(this.key, f(this.value));
  };

export default KeyValuePair;
