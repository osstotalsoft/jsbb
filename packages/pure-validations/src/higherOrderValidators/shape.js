import { $do } from "@totalsoft/zion";
import { concat } from "ramda";
import Reader from "@totalsoft/zion/data/reader";
import Maybe from "@totalsoft/zion/data/maybe";
import field from "./field";

const { Nothing } = Maybe;

export default function shape(validatorObj) {
  return $do(function*() {
    return yield Object.entries(validatorObj)
      .map(([k, v]) => field(k, v))
      .reduce(concat, Reader.of(Nothing));
  });
}
