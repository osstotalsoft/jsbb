import Reader from "@totalsoft/zion/data/reader";
import Maybe from "@totalsoft/zion/data/maybe";
import { $do } from "@totalsoft/zion";
import { checkValidators } from "./_utils";

const { Nothing } = Maybe;

export default function fromParent(validatorFactory) {
  return $do(function*() {
    const [, { parentModel }] = yield Reader.ask();
    if (parentModel === null || parentModel === undefined) {
      return Nothing;
    }
    const v = validatorFactory(parentModel);
    checkValidators(v);
    return yield v;
  });
}
