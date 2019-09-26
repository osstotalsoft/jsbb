import { $do, concat } from "../fantasy/prelude";
import Reader from "../fantasy/data/reader";
import { Validation } from "../validation";
import { Validator } from "../validator";
import field from "./field";
import { checkValidators } from "./_utils";

const successValidator = Validator.of(Validation.Success());

export default function items(itemValidator) {
  checkValidators(itemValidator);
  return $do(function*() {
    const [items] = yield Reader.ask();
    if (items === null || items === undefined) {
      return successValidator;
    }
    return items.map((_, index) => field(index, itemValidator)).reduce(concat, successValidator);
  });
}
