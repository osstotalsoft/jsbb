import { $do } from "@totalsoft/zion";
import { addIndex, map } from "ramda";
import { Validator } from "../validator";
import field from "./field";
import { checkValidators } from "./_utils";
import { Success } from "../validation";
import concatFailure from "./concatFailure"

var mapWithIndex = addIndex(map)

export default function items(itemValidator) {
  checkValidators(itemValidator);
  return $do(function* () {
    const [items] = yield Validator.ask();
    if (items === null || items === undefined) {
      return Success;
    }

    return yield items |> mapWithIndex((_, i) => field(i, itemValidator)) |> concatFailure
  });
}
