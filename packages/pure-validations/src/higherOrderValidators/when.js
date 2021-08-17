import { $do } from "@totalsoft/zion";
import { curry } from "ramda";
import { checkValidators } from "./_utils";
import { Validator } from "../validator";
import { Success } from "../validation"


const when = curry(function when(predicate, validator) {
  const predicateReader = ensurePredicate(predicate);
  checkValidators(validator);

  return $do(function* () {
    const isTrue = yield predicateReader;
    return isTrue ? yield validator : Success;
  });
});

function ensurePredicate(predicate) {
  if (typeof predicate === "boolean") {
    return Validator.of(predicate);
  }
  if (typeof predicate === "function") {
    return Validator(predicate);
  }

  checkValidators(predicate);

  return predicate;
}

export default when;
