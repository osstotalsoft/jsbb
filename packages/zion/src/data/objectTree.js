import { tagged } from "daggy";
import * as fl from "fantasy-land";
import Map from './map';
import { equals, map, concat, curry } from "ramda";

//data ObjectTree a b :: Maybe a * Map b (ObjectTree a)
const ObjectTree = tagged("ObjectTree", ["value", "children"]);

ObjectTree.Leaf = function(value) {
  return ObjectTree(value, Map({}));
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
  return equals(this.value, that.value) && equals(this.children, that.children);
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
