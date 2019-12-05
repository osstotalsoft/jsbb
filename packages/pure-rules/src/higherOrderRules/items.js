import Reader from "@totalsoft/zion/data/reader";
import { map, addIndex } from "ramda";
import { $do } from "@totalsoft/zion";
import { field, chainRules } from "./";
import { checkRules } from "../_utils";

const mapIndexed = addIndex(map);

export default function items(itemRule) {
  checkRules(itemRule);
  return $do(function* () {
    const [items] = yield Reader.ask();
    if (items === null || items === undefined || items.length === 0) {
      return items;
    }
    return yield items
      |> mapIndexed((_, index) => field(index, itemRule))
      |> chainRules;

  });
}
