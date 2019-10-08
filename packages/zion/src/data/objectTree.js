import { tagged } from "daggy";
import fl from "fantasy-land";
import { map, eq, concat, empty } from "../prelude";
import curry from "lodash.curry";
import Map from './map';

//data ObjectTree a b :: Maybe a * Map b (ObjectTree a)
const ObjectTree = tagged("ObjectTree", ["value", "children"]);

ObjectTree.Leaf = function(value) {
  return ObjectTree(value, empty(Map));
};

ObjectTree.getValue = curry(function getValue(tree) {
  return tree.value;
})

ObjectTree.getChildAt = curry(function getChildAt(key, tree) {
  const result = tree.children |> Map.getValueAt(key);
  return result;
})

/* Setoid a => Setoid (ObjectTree a) */
ObjectTree.prototype[fl.equals] = function(that) {
  return eq(this.value, that.value) && eq(this.children, that.children);
};

/* Functor ObjectTree */
ObjectTree.prototype[fl.map] = function(f) {
  return ObjectTree(this.value |> map(f), this.children |> map(map(f)));
};

/* Semigroup ObjectTree */
ObjectTree.prototype[fl.concat] = function(that) {
  return ObjectTree(concat(this.value, that.value), concat(this.children, that.children));
};

export default ObjectTree;