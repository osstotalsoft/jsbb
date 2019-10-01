import { tagged } from "daggy";
import fl from "fantasy-land";
import { concat, map, reduce, empty, equals } from "../prelude";
import { Just, Nothing } from "./maybe";
import List from "./list";
import KeyValuePair from "./keyValuePair";

//data Map a b :: [a] * a -> Maybe<b>
const Map = tagged("Map", ["keys", "lookupFn"]);

const emptyLookupFn = _ => Nothing;

Map.fromList = function fromList(list) {
  const keys = list |> map(KeyValuePair.getKey);
  const lookupFn =
    list
    |> reduce(
      (acc, current) =>
        function(key) {
          return KeyValuePair.getKey(current) == key ? Just(KeyValuePair.getValue(current)) : acc(current);
        },
      emptyLookupFn
    );
  return Map(keys, lookupFn);
};

Map.toList = function toList(map) {
  return map.keys |> reduce((acc, current) => acc |> concat(KeyValuePair(current, this.lookupFn(current)), empty(List)));
};

/* Setoid a => Setoid (Map a) */
Map.prototype[fl.equals] = function(that) {
  return equals(Map.toList(that), Map.toList(this));
};

/* Functor RoseTree */
Map.prototype[fl.map] = function(f) {
  return Map.fromList(Map.toList(this) |> map(f));
};

/* Foldable Map */
Map.prototype[fl.reduce] = function(f, acc) {
  return Map.toList(this) |> reduce(f, acc);
};

/* Semigroup Map */
Map.prototype[fl.concat] = function(that) {
  const keys = List.fromArray([...new Set([...List.toArray(this.keys), ...List.toArray(that.keys)])]);
  const lookupFn = function(key) {
    var thisValue = this.lookupFn(key);
    var thatValue = that.lookupFn(key);
    return concat(thisValue, thatValue);
  };

  return Map(keys, lookupFn);
};

/* Monoid Map */
Map[fl.empty] = () => Map(empty(List), emptyLookupFn);
