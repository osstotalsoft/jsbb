import and from "./and";
import { variadicApply, checkValidators } from "./_utils";

const all = variadicApply(function all(...validators) {
  checkValidators(...validators);
  return validators.reduce(and);
});

export default all;
