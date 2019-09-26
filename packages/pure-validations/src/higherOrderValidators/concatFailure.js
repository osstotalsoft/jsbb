import { concat } from "../fantasy/prelude";
import { variadicApply, checkValidators } from "./_utils";

const concatFailure = variadicApply(function concatFailure(...validators) {
  checkValidators(...validators);
  return validators.reduce(concat);
});

export default concatFailure;
