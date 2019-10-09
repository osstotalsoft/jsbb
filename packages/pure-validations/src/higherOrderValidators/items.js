import { $do, concat, empty } from "@totalsoft/zion";
import Reader from "@totalsoft/zion/data/reader";
import Maybe from "@totalsoft/zion/data/maybe";
import field from "./field";
import { checkValidators } from "./_utils";

export default function items(itemValidator) {
  checkValidators(itemValidator);
  return $do(function*() {
    const [items] = yield Reader.ask();
    if (items === null || items === undefined) {
      return empty(Maybe);
    }

    let validations = [];
    for (let i = 0; i < items.length; i++) {
      validations.push(yield field(i, itemValidator));
    }

    return validations.reduce(concat, empty(Maybe));
  });
}
