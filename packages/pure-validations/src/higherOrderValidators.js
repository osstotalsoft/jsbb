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
  return $do(function*() {
    const isTrue = yield Reader(predicate);
    return isTrue ? validator : Validator.of(Validation.Success());
  });
}

export function withModel(validatorFactory) {
  return $do(function*() {
    const [model] = yield Reader.ask();
    return validatorFactory(model);
  });
}

export function field(key, validator) {
  return Validator(function(model, context) {
    const field = model[key];
    const fieldContext = context && { ...context, fieldPath: [...(context.fieldPath || []), key] };

    if (field === undefined || (fieldContext && fieldContext.fieldFilter && !fieldContext.fieldFilter(fieldContext.fieldPath))) {
      debugPath(fieldContext, "skipped");
      return Validation.Success();
    }

    const validation = validate(validator, field, fieldContext);
    const isSuccess = Validation._isSuccess(validation);
    debugPath(fieldContext, isSuccess ? "succeded" : "failed");
    const fields = { [key]: validation };
    return isSuccess ? Validation.Success(fields) : Validation.Failure([], fields);
  });
}

export function fields(validatorObj) {
  return Object.entries(validatorObj)
    .map(([k, v]) => field(k, v))
    .reduce(allReducer);
}

export function items(itemValidator) {
  return $do(function*() {
    const [model] = yield Reader.ask();
    return model.map((_, index) => field(index, itemValidator)).reduce(allReducer);
  });
}

// export function items(itemValidator) {
//   return function(model, context) {
//     if (!Array.isArray(model)) return Validation.Success(); // TBD

//     const [fields, isSuccess] = model.reduce(
//       function([fields, isSuccess], item, index) {
//         const itemContext = context && { ...context, fieldPath: [...(context.fieldPath || []), index.toString()] };

//         if (itemContext && itemContext.fieldFilter && !itemContext.fieldFilter(itemContext.fieldPath)) {
//           debugPath(itemContext, "skipped");

//           fields[index.toString()] = Validation.Success();
//           return [fields, isSuccess];
//         }

//         const validation = itemValidator(item, itemContext);
//         isSuccess =
//           isSuccess &&
//           Validation.match(validation, {
//             Success: _ => true,
//             Failure: _ => false
//           });

//         fields[index.toString()] = validation;

//         debugPath(itemContext, isSuccess ? "succeded" : "failed");

//         return [fields, isSuccess];
//       },
//       [{}, true]
//     );

//     return isSuccess ? Validation.Success(fields) : Validation.Failure([], fields);
//   };
// }

export const dirtyFieldsOnly = curry(function dirtyFieldsOnly(dirtyFields, validator) {
  return function(model, context) {
    const dirtyFieldsContext = { ...context, fieldFilter: path => getInnerProp(path, dirtyFields) };
    return validator(model, dirtyFieldsContext);
  };
});

export function debug(validator) {
  return function(model, context) {
    const debugContext = { ...context, debug: true, debugFn: console.log };
    return validator(model, debugContext);
  };
}

function getInnerProp(searchKeyPath, obj) {
  const [prop, ...rest] = searchKeyPath;
  return prop ? getInnerProp(rest, obj[prop]) : obj;
}

function debugPath(context, message) {
  if (context && context.debug && context.debugFn) {
    context.debugFn(`Validation ${message} for path ${context.fieldPath.reduce((x, y) => x + "." + y)}`);
  }
}
