import { tagged } from "daggy";
import fl from "fantasy-land";
import { map, equals, concat, empty } from "../prelude";

//data RoseTree a b :: Maybe a * Map b (RoseTree a)
const RoseTree = tagged("RoseTree", ["value", "children"]);

RoseTree.Leaf = function(value) {
  return RoseTree(value, empty(Map));
};

/* Setoid a => Setoid (RoseTree a) */
RoseTree.prototype[fl.equals] = function(that) {
  return equals(this.value, that.value) && equals(this.children, that.children);
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
