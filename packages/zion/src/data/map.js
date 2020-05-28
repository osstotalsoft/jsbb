import { tagged } from "daggy";
import * as fl from "fantasy-land";
import Maybe from "./maybe";
import List from "./list";
import KeyValuePair from "./keyValuePair";
import { equals, map, concat, reduce, identity, curry } from "ramda";

const { Just, Nothing } = Maybe;

//data Map a b :: [a] * a -> Maybe<b>
const Map = tagged("Map", ["obj"]);

Map.getValueAt = curry(function getValueAt(key, aMap) {
  const x = aMap.obj[key];
  if (x == undefined) {
    return Nothing;
  }
  return Just(x);
})

Map.fromObj = function fromObj(obj){
  return Map(obj);
}

Map.fromList = function fromList(list) {
  const obj = list |> reduce((acc, current) => (acc[KeyValuePair.getKey(current)] = KeyValuePair.getValue(current)), {});
  return Map(obj);
};

Map.toList = function toList(aMap) {
  return List.fromArray(Object.keys(aMap)) |> map(key => KeyValuePair(key, aMap.obj[key]));
};

/* Setoid a => Setoid (Map a) */
Map.prototype[fl.equals] = function(that) {
  return equals(Map.toList(that), Map.toList(this));
};

/* Functor ObjectTree */
Map.prototype[fl.map] = function(f) {
  return Map.fromList(Map.toList(this) |> map(f));
};

/* Foldable Map */
Map.prototype[fl.reduce] = function(f, acc) {
  return Map.toList(this) |> reduce(f, acc);
};

/* Semigroup Map */
Map.prototype[fl.concat] = function(that) {
  const fields = [...new Set([...Object.keys(this.obj), ...Object.keys(that.obj)])];
  var result = {};
  for (let f of fields) {
    const thisValue = Map.getValueAt(f, this);
    const thatValue = Map.getValueAt(f, that);
    const concatValue = concat(thisValue, thatValue);
    result[f] = concatValue.cata({
      Just: identity,
      Nothing: _ => undefined //???????????
    });
  }

  return Map(result);
};

/* Monoid Map */
Map[fl.empty] = () => Map({});

export default Map;
