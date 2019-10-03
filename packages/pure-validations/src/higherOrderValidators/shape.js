import { $do, concat } from "../fantasy/prelude";
import Reader from "../fantasy/data/reader";
import Maybe from "../fantasy/data/maybe";
import field from "./field";

const { Nothing } = Maybe;

export default function shape(validatorObj) {
  return $do(function*() {
    const [model] = yield Reader.ask();
    if (model === null || model === undefined) {
      return Reader.of(Nothing);
    }

    return Object.entries(validatorObj)
      .map(([k, v]) => field(k, v))
      .reduce(concat, Reader.of(Nothing));
  });
}
