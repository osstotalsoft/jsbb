import { Validator } from "../validator";
import { $do, concat, map} from "../fantasy/prelude";
export default function or(f1, f2) {
  return $do(function*() {
    const v1 = yield f1;

    return v1.cata({
      Just: err1 => f2 |> map(map(concat(err1))),
      Nothing: _ => Validator.of(v1)
    });
  });
}