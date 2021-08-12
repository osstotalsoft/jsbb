// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { contramap, $do } from "@totalsoft/zion";
import Reader from "@totalsoft/zion/data/reader";
import Maybe from "@totalsoft/zion/data/maybe";
import { map, curry } from "ramda";

import ValidationError from "../validationError";
import { checkValidators } from "./_utils";

const { Nothing } = Maybe;

const field = curry(function field(key, validator) {
  checkValidators(validator);
  return (
    validator
    |> _logFieldPath
    |> _filterFieldPath
    |> contramap((model, ctx) => [model ? model[key] : undefined , _getFieldContext(model, ctx, key)])
    |> map(map(ValidationError.moveToField(key)))
  );
});

function _logFieldPath(validator) {
  return $do(function*() {
    const [, fieldContext] = yield Reader.ask();
    const validation = yield validator;
    _log(fieldContext, `Validation ${Nothing.is(validation) ? "succeded" : "failed"} for path ${fieldContext.fieldPath.join(".")}`);
    return validation;
  });
}

function _filterFieldPath(validator) {
  return $do(function*() {
    const [, fieldContext] = yield Reader.ask();
    return !fieldContext.fieldFilter(fieldContext) ? Nothing : yield validator;
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
