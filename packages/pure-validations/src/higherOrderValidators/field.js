import { map, contramap, $do } from "../fantasy/prelude";
import Reader from "../fantasy/data/reader";
import Maybe from "../fantasy/data/maybe";
import ValidationError from "../validationError";
import { checkValidators } from "./_utils";

const { Nothing } = Maybe;

export default function field(key, validator) {
  checkValidators(validator);
  return (
    validator
    |> _logFieldPath
    |> _filterFieldPath
    |> contramap((model, ctx) => [model[key], _getFieldContext(ctx, key)])
    |> map(map(ValidationError.moveToField(key)))
  );
}

function _logFieldPath(validator) {
  return $do(function*() {
    const [, fieldContext] = yield Reader.ask();
    const validation = yield validator;
    _log(fieldContext, `Validation ${Nothing.is(validation) ? "succeded" : "failed"} for path ${fieldContext.fieldPath.join(".")}`);
    return Reader.of(validation);
  });
}

function _filterFieldPath(validator) {
  return $do(function*() {
    const [, fieldContext] = yield Reader.ask();
    return !fieldContext.fieldFilter(fieldContext) ? Reader.of(Nothing) : validator;
  });
}

function _getFieldContext(context, key) {
  return { ...context, fieldPath: [...context.fieldPath, key] };
}

function _log(context, message) {
  if (context.log) {
    context.logger.log(message);
  }
}
