import Reader from "@totalsoft/arcadia/data/reader";
import Maybe from "@totalsoft/arcadia/data/maybe";
import { $do, concat } from "@totalsoft/arcadia";
import { variadicApply, checkValidators } from "./_utils";

function _stopOnFirstFailure(f1, f2) {
  return $do(function*() {
    const v1 = yield f1;
    return Maybe.Just.is(v1) ? Reader.of(v1) : concat(Reader.of(v1), f2);
  });
}

const stopOnFirstFailure = variadicApply(function stopOnFirstFailure(...validators) {
  checkValidators(...validators);
  return validators.reduce(_stopOnFirstFailure);
});

export default stopOnFirstFailure;
