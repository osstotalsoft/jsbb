import { contramap } from "@totalsoft/arcadia";
import { checkValidators } from "./_utils";
import curry from "lodash.curry";

const logTo = curry(function logTo(logger, validator) {
  checkValidators(validator);
  return validator |> contramap((model, context) => [model, { ...context, log: true, logger }]);
});

export default logTo;
