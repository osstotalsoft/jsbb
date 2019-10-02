import { tagged } from "daggy";
import fl from "fantasy-land";
import { map, eq, concat, empty } from "../prelude";
import curry from "lodash.curry";
import Map from './map';

//data RoseTree a b :: Maybe a * Map b (RoseTree a)
const RoseTree = tagged("RoseTree", ["value", "children"]);

RoseTree.Leaf = function(value) {
  return RoseTree(value, empty(Map));
};

RoseTree.getValue = curry(function getValue(tree) {
  return tree.value;
})

RoseTree.getChildAt = curry(function getChildAt(key, tree) {
  const result = tree.children |> Map.getValueAt(key);
  return result;
})

/* Setoid a => Setoid (RoseTree a) */
RoseTree.prototype[fl.equals] = function(that) {
  return eq(this.value, that.value) && eq(this.children, that.children);
};

/* Functor RoseTree */
RoseTree.prototype[fl.map] = function(f) {
  return RoseTree(this.value |> map(f), this.children |> map(map(f)));
};

/* Semigroup RoseTree */
RoseTree.prototype[fl.concat] = function(that) {
  return RoseTree(concat(this.value, that.value), concat(this.children, that.children));
};

export default RoseTree;
