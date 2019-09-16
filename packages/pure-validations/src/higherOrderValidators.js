import { Reader } from "./reader";
import { Validation } from "./validation";
import { AllValidation } from "./allValidation";
import { AnyValidation } from "./anyValidation";
import { Validator } from "./validator";
import { $do, lift2, concat, fmap, contramap } from "./polymorphicFns";
import curry from "lodash.curry";
import fl from "fantasy-land"

//export const logicalAndOperator = x => (x ? y => y : _ => x); //logical short-circuiting

const skip = Validator[fl.of](Validation.Success())

function allReducer(f1, f2) {
  const allValidations = v1 => v2 => concat(AllValidation(v1), AllValidation(v2)).value
  return lift2(allValidations, f1, f2);
}

export function all(...validators) {
  return validators.reduce(allReducer);
}

function anyReducer(f1, f2) {
  const anyValidation = v1 => v2 => concat(AnyValidation(v1), AnyValidation(v2)).value
  return lift2(anyValidation, f1, f2);
}

export function any(...validators) {
  return validators.reduce(anyReducer);
}

export function when(predicate, validator) {
  return $do(function* () {
    const isTrue = yield Reader(predicate);
    return isTrue ? validator : skip;
  });
}

export function withModel(validatorFactory) {
  return $do(function* () {
    const [model] = yield Reader.ask();
    return validatorFactory(model);
  });
}

export function field(key, validator) {
  return (validator |> _filterFieldPath |> _debugFieldPath) 
    |> contramap((model, ctx) => [model[key], _getFieldContext(ctx, key)])
    |> fmap(_mapFieldToObjValidation(key))
  //.map(Validation.field(key))
}

export function fields(validatorObj) {
  return Object.entries(validatorObj)
    .map(([k, v]) => field(k, v))
    .reduce(allReducer, skip);
}

export function items(itemValidator) {
  return $do(function* () {
    const [model] = yield Reader.ask();
    return model.map((_, index) => field(index, itemValidator)).reduce(allReducer, skip);
  });
}

export const filterFields = curry(function filterFields(fieldFilter, validator) {
  return validator |> contramap((model, context) => [model, { ...context, fieldFilter }])
});

export const debug = curry(function debug(debugFn, validator) {
  return validator |> contramap((model, context) => [model, { ...context, debug: true, debugFn }])
});

const _mapFieldToObjValidation = curry(function _mapFieldToObject(key, validation) {
  const fields = { [key]: validation }
  return Validation.match(validation, {
    Success: _ => Validation.Success(fields),
    Failure: _ => Validation.Failure([], fields)
  })
})

function _getFieldContext(context, key) {
  return { ...context, fieldPath: [...context.fieldPath, key] }
}

function _debug(context, message) {
  if (context.debug && context.debugFn) {
    context.debugFn(message);
  }
}

function _debugFieldPath(validator) {
  return $do(function* () {
    const [_, fieldContext] = yield Reader.ask()
    const validation = yield validator;
    _debug(fieldContext, `Validation ${Validation._isSuccess(validation) ? 'succeded' : 'failed'} for path ${fieldContext.fieldPath.reduce((x, y) => x + "." + y)}`)
    return Validator[fl.of](validation);
  })
}

function _filterFieldPath(validator) {
  return $do(function* () {
    const [field, fieldContext] = yield Reader.ask()
    return (field === undefined || !fieldContext.fieldFilter(fieldContext.fieldPath)) ? skip : validator;
  })
}
