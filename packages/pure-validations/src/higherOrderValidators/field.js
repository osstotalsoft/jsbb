import { contramap, $do } from "@totalsoft/zion";
import { Validator } from "../validator";
import { map, curry } from "ramda";

import ValidationError from "../validationError";
import { Success, isValid } from "../validation"
import { checkValidators } from "./_utils";

const field = curry(function field(key, validator) {
  checkValidators(validator);
  return (
    validator
    |> _logFieldPath
    |> _filterFieldPath
    |> contramap((model, ctx) => [model ? model[key] : undefined, _getFieldContext(model, ctx, key)])
    |> map(map(ValidationError.moveToField(key)))
  );
});

function _logFieldPath(validator) {
  return $do(function* () {
    const [, fieldContext] = yield Validator.ask();
    const validation = yield validator;
    _log(fieldContext, `Validation ${isValid(validation) ? "succeded" : "failed"} for path ${fieldContext.fieldPath.join(".")}`);
    return validation;
  });
}

function _filterFieldPath(validator) {
  return $do(function* () {
    const [, fieldContext] = yield Validator.ask();
    return !fieldContext.fieldFilter(fieldContext) ? Success : yield validator;
  });
}

function _getFieldContext(model, context, key) {
  return { ...context, fieldPath: [...context.fieldPath, key], parentModel: model, parentContext: context };
}

function _log(context, message) {
  if (context.log) {
    context.logger.log(message);
  }
}

export default field;
