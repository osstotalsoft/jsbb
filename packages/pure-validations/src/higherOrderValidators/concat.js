import concatAnd from "./concatAnd";
import { variadicApply, checkValidators } from "./_utils";

const concat = variadicApply(function concat(...validators) {
  checkValidators(...validators);
  return validators.reduce(concatAnd);
});

export default concat;
