import { $do } from "@totalsoft/zion";
import { concat } from "ramda";
import { Validator } from "../validator";
import field from "./field";
import { checkValidators } from "./_utils";
import { Success } from "../validation";

export default function items(itemValidator) {
  checkValidators(itemValidator);
  return $do(function*() {
    const [items] = yield Validator.ask();
    if (items === null || items === undefined) {
      return Success;
    }

    let validations = [];
    for (let i = 0; i < items.length; i++) {
      validations.push(yield field(i, itemValidator));
    }

    return validations.reduce(concat, Success);
  });
}
