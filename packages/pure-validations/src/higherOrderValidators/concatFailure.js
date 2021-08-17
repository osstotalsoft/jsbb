import { concat } from "ramda";
import { variadicApply, checkValidators } from "./_utils";
import { Validator } from "../validator";
import { Success } from "../validation"

const concatFailure = variadicApply(function concatFailure(...validators) {
  checkValidators(...validators);
  return validators.reduce(concat, Validator.of(Success));
});

export default concatFailure;
