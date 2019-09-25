import Reader from "../fantasy/data/reader";
import { Validation } from "../validation";
import { Validator } from "../validator";
import { $do } from "../fantasy/prelude";
import curry from "lodash.curry";
import { checkValidators } from "./_utils";

const when = curry(function when(predicate, validator) {
  checkValidators(validator);
  return $do(function*() {
    const isTrue = yield Reader(predicate);
    return isTrue ? validator : Validator.of(Validation.Success());
  });
});

export default when;
