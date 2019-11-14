import { contramap } from "@totalsoft/zion";
import { checkValidators } from "../_utils";
import { curry } from "ramda";

const logTo = curry(function logTo(logger, rule) {
  checkValidators(rule);
  return rule |> contramap((model, context) => [model, { ...context, log: true, logger }]);
});

export default logTo;
