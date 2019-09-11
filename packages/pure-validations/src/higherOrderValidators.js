import { Reader } from "./reader";
import { Validation } from "./validation";
import { Validator, validate } from "./validator";
import { $do, chain, ap, fmap, lift2 } from "./polymorphicFns";
import curry from "lodash.curry";

export const logicalAndOperator = x => (x ? y => y : _ => x); //logical short-circuiting

function allReducer(f1, f2) {
  return lift2(Validation.all, f1, f2);
}

export function all(...validators) {
  return validators.reduce(allReducer);
}

function anyReducer(f1, f2) {
  return lift2(Validation.any, f1, f2);
}

export function any(...validators) {
  return validators.reduce(anyReducer);
}

export function when(predicate, validator) {
  return $do(function* () {
    const isTrue = yield Reader(predicate);
    return isTrue ? validator : Validator.of(Validation.Success());
  });
}

export function withModel(validatorFactory) {
  return $do(function* () {
    const [model] = yield Reader.ask();
    return validatorFactory(model);
  });
}

export function field(key, validator) {
  return Validator(function (model, context) {
    const field = model[key];
    const fieldContext = context && { ...context, fieldPath: [...(context.fieldPath || []), key] };

    const validation =
      (field === undefined || (fieldContext && fieldContext.fieldFilter && !fieldContext.fieldFilter(fieldContext.fieldPath)))
        ? Validation.Skipped()
        : validate(validator, field, fieldContext);

    debugPath(fieldContext, validation);
    const fields = { [key]: validation };

    return Validation._isSuccess(validation) ? Validation.Success(fields)
      : Validation._isFailure(validation) ? Validation.Failure([], fields)
        : Validation.Skipped(fields);
  });
}

export function fields(validatorObj) {
  return Object.entries(validatorObj)
    .map(([k, v]) => field(k, v))
    .reduce(allReducer);
}

export function items(itemValidator) {
  return $do(function* () {
    const [model] = yield Reader.ask();
    return model.map((_, index) => field(index, itemValidator)).reduce(allReducer, Validator.of(Validation.Skipped()));
  });
}

export const dirtyFieldsOnly = curry(function dirtyFieldsOnly(dirtyFields, validator) {
  return function (model, context) {
    const dirtyFieldsContext = { ...context, fieldFilter: path => getInnerProp(path, dirtyFields) };
    return validator(model, dirtyFieldsContext);
  };
});

export const filterFields = curry(function filterFields(fieldFilter, validator) {
  return validator.contramap((model, context) => [model, { ...context, fieldFilter }])
});

export const debug = curry(function debug(debugFn, validator) {
  return validator.contramap((model, context) => [model, { ...context, debug: true, debugFn }])
});

/*export function debug(validator) {
  return function (model, context) {
    const debugContext = { ...context, debug: true, debugFn: console.log };
    return validator(model, debugContext);
  };
}*/

function getInnerProp(searchKeyPath, obj) {
  const [prop, ...rest] = searchKeyPath;
  return prop ? getInnerProp(rest, obj[prop]) : obj;
}

function debugPath(context, validation) {
  if (context && context.debug && context.debugFn) {
    context.debugFn(`Validation ${Validation._getType(validation)} for path ${context.fieldPath.reduce((x, y) => x + "." + y)}`);
  }
}
