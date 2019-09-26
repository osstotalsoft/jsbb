import { $do, concat } from "../fantasy/prelude";
import Reader from "../fantasy/data/reader";
import { Validation } from "../validation";
import { Validator } from "../validator";
import field from "./field";

const successValidator = Validator.of(Validation.Success());

export default function shape(validatorObj) {
  return $do(function*() {
    const [model] = yield Reader.ask();
    if (model === null || model === undefined) {
      return successValidator;
    }

    return Object.entries(validatorObj)
      .map(([k, v]) => field(k, v))
      .reduce(concat, successValidator);
  });
}
