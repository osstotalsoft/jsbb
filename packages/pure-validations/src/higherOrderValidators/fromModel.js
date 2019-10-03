import Reader from "../fantasy/data/reader";
import Maybe from "../fantasy/data/maybe";
import { $do } from "../fantasy/prelude";
import { checkValidators } from "./_utils";

export default function fromModel(validatorFactory) {
  return $do(function*() {
    const [model] = yield Reader.ask();
    if (model === null || model === undefined) {
      return Reader.of(Maybe.Nothing);
    }
    const v = validatorFactory(model);
    checkValidators(v);
    return v;
  });
}
