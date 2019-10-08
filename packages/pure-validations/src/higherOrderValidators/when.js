import Reader from "@totalsoft/zion/data/reader";
import Maybe from "@totalsoft/zion/data/maybe";
import { $do } from "@totalsoft/zion";
import curry from "lodash.curry";
import { checkValidators } from "./_utils";

const when = curry(function when(predicate, validator) {
  checkValidators(validator);
  return $do(function*() {
    const isTrue = yield Reader(predicate);
    return isTrue ? validator : Reader.of(Maybe.Nothing);
  });
});

export default when;
