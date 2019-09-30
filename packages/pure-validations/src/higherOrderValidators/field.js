import { map, contramap, $do } from "../fantasy/prelude";
import Reader from "../fantasy/data/reader";
import { Validation, isValid } from "../validation";
import { Validator } from "../validator";
import { checkValidators } from "./_utils";
import curry from "lodash.curry";

export default function field(key, validator) {
  checkValidators(validator);
  return (
    validator
    |> _logFieldPath
    |> _filterFieldPath
    |> contramap((model, ctx) => [model[key], _getFieldContext(ctx, key)])
    |> map(_mapFieldToObjValidation(key))
  );
}

function _logFieldPath(validator) {
  return $do(function*() {
    const [, fieldContext] = yield Reader.ask();
    const validation = yield validator;
    _log(fieldContext, `Validation ${isValid(validation) ? "succeded" : "failed"} for path ${fieldContext.fieldPath.join(".")}`);
    return Validator.of(validation);
  });
}

function _filterFieldPath(validator) {
  return $do(function*() {
    const [, fieldContext] = yield Reader.ask();
    return !fieldContext.fieldFilter(fieldContext) ? Validator.of(Validation.Success()) : validator;
  });
}

const _mapFieldToObjValidation = curry(function _mapFieldToObjValidation(key, validation) {
  const fields = { [key]: validation };
  return isValid(validation) ? Validation.Success() : Validation.Failure([], fields);
});

function _getFieldContext(context, key) {
  return { ...context, fieldPath: [...context.fieldPath, key] };
}

function _log(context, message) {
  if (context.log) {
    context.logger.log(message);
  }
}
