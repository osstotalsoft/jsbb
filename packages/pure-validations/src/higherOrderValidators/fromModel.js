import Reader from "../fantasy/data/reader";
import { $do } from "../fantasy/prelude";
import { Validation } from "../validation";
import { Validator } from "../validator";
import { checkValidators } from "./_utils";

export default function fromModel(validatorFactory) {
  return $do(function*() {
    const [model] = yield Reader.ask();
    if (model === null || model === undefined) {
      return Validator.of(Validation.Success());
    }
    const v = validatorFactory(model);
    checkValidators(v);
    return v;
  });
}
