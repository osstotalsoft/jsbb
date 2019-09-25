import Or from "./or";
import { variadicApply, checkValidators } from "./_utils";

const any = variadicApply(function any(...validators) {
  checkValidators(...validators);
  return validators.reduce(Or);
});

export default any;
