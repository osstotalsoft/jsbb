import { $do } from "@totalsoft/zion";
import { concat } from "ramda";
import { variadicApply, checkValidators } from "./_utils";
import { isValid } from "../validation"

function _stopOnFirstFailure(f1, f2) {
  return $do(function*() {
    const v1 = yield f1;
    const result = !isValid(v1) ? v1 : concat(v1, yield f2);
    return result;
  });
}

const stopOnFirstFailure = variadicApply(function stopOnFirstFailure(...validators) {
  checkValidators(...validators);
  return validators.reduce(_stopOnFirstFailure);
});

export default stopOnFirstFailure;
