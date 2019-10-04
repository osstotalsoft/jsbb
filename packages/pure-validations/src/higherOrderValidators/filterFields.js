import { contramap } from "@totalsoft/arcadia";
import { checkValidators } from "./_utils";
import curry from "lodash.curry";

const filterFields = curry(function filterFields(fieldFilter, validator) {
    checkValidators(validator);
    return validator |> contramap((model, context) => [model, { ...context, fieldFilter }]);
  });

export default filterFields