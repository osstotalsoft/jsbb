import { $do, concat } from "../fantasy/prelude";
import Reader from "../fantasy/data/reader";
import Maybe from "../fantasy/data/maybe";
import field from "./field";
import { checkValidators } from "./_utils";

const { Nothing } = Maybe;

export default function items(itemValidator) {
  checkValidators(itemValidator);
  return $do(function*() {
    const [items] = yield Reader.ask();
    if (items === null || items === undefined) {
      return Reader.of(Nothing);
    }
    return items.map((_, index) => field(index, itemValidator)).reduce(concat, Reader.of(Nothing));
  });
}
