import { $do } from "@totalsoft/zion";
import { concat } from "ramda";
import { Validator } from "../validator";
import Maybe from "@totalsoft/zion/data/maybe";
import field from "./field";

const { Nothing } = Maybe;

export default function shape(validatorObj) {
  return $do(function*() {
    return yield Object.entries(validatorObj)
      .map(([k, v]) => field(k, v))
      .reduce(concat, Validator.of(Nothing));
  });
}
