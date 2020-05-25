import Reader from "@totalsoft/zion/data/reader";
import { $do } from "@totalsoft/zion";
import { checkValidators } from "./_utils";

export default function fromModel(validatorFactory) {
  return $do(function*() {
    const [model] = yield Reader.ask();

    const v = validatorFactory(model);
    checkValidators(v);
    return yield v;
  });
}
