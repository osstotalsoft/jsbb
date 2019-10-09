import Reader from "@totalsoft/zion/data/reader";
import Maybe from "@totalsoft/zion/data/maybe";
import { $do } from "@totalsoft/zion";
import { checkValidators } from "./_utils";

const {Nothing} = Maybe;

export default function fromModel(validatorFactory) {
  return $do(function*() {
    const [model] = yield Reader.ask();
    if (model === null || model === undefined) {
      return Nothing;
    }
    const v = validatorFactory(model);
    checkValidators(v);
    return yield v;
  });
}
