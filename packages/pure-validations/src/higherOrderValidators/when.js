import Reader from "@totalsoft/zion/data/reader";
import Maybe from "@totalsoft/zion/data/maybe";
import { $do } from "@totalsoft/zion";
import { curry } from "ramda";
import { checkValidators } from "./_utils";

const { Nothing } = Maybe;

const when = curry(function when(predicate, validator) {
  checkValidators(validator);
  return $do(function*() {
    const isTrue = yield Reader(predicate);
    return isTrue ? yield validator : Nothing;
  });
});

export default when;
