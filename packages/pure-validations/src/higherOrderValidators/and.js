import { Validation } from "../validation";
import { Validator } from "../validator";
import { $do, concat } from "../fantasy/prelude";

export default function and(f1, f2) {
  return $do(function*() {
    const v1 = yield f1;
    return !Validation.isValid(v1) ? Validator.of(v1) : concat(Validator.of(v1), f2);
  });
}
