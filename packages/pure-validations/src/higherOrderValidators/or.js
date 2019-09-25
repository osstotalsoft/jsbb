import { Validation } from "../validation";
import { Validator } from "../validator";
import { $do } from "../fantasy/prelude";
//import { chain } from "fantasy-land";

export default function Or(f1, f2) {
  return $do(function*() {
    const v1 = yield f1;
    if (Validation.isValid(v1)) {
      return Validator.of(v1);
    }
    return f2;
  });
}

// function anyValidation(v1, v2) {
//   return v1 |> chain(_=> v2)
// }
