// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import Maybe from "@totalsoft/zion/data/maybe";
import { $do } from "@totalsoft/zion";
import { concat } from "ramda";
import { variadicApply, checkValidators } from "./_utils";

function _stopOnFirstFailure(f1, f2) {
  return $do(function*() {
    const v1 = yield f1;
    const result = Maybe.Just.is(v1) ? v1 : concat(v1, yield f2);
    return result;
  });
}

const stopOnFirstFailure = variadicApply(function stopOnFirstFailure(...validators) {
  checkValidators(...validators);
  return validators.reduce(_stopOnFirstFailure);
});

export default stopOnFirstFailure;
