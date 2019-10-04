import Reader from "@totalsoft/arcadia/lib/data/reader";
import Maybe from "@totalsoft/arcadia/lib/data/maybe";
import { $do } from "@totalsoft/arcadia";
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
