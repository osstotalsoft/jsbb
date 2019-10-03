import Reader from "../fantasy/data/reader";
import Maybe from "../fantasy/data/maybe";
import { $do } from "../fantasy/prelude";
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
