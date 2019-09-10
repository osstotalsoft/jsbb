import { Reader } from "./reader";
import { Validation } from "./validation";
import { Validator } from "./validator";
import { $do, chain } from "./polymorphicFns";
import curry from "lodash.curry";

// export function first1(...validators) {
//   return validators.reduce((f1, f2) =>
//     $do(function*() {
//       const v1 = yield f1;
//       return Validation.isSuccess(v1) ? f2 : Validator.of(v1);
//     })
//   );
// }

// export function first(...validators) {
//   return validators.reduce((f1, f2) =>
//   f1 |> chain(v1 => Validation.isSuccess(v1) ? f2 : Validator.of(v1))
//   );

export const logicalAndOperator = x => (x ? identity : pure(x)); //logical short-circuiting

function identity(x) {
  return x;
}

const pure = curry(function pure(x) {
  return _ => x;
});

const apply = curry(function apply(fnFunctor, valueFunctor) {
  return (model, context) => {
    const fn = fnFunctor(model, context);
    const val = valueFunctor(model, context);

    return fn(val);
  };
});

const fmap = curry(function fmap(fn, valueFunctor) {
  return apply(pure(fn), valueFunctor);
});

const lift2 = curry(function lift2(op, applicative1, applicative2) {
  return apply(fmap(op, applicative1), applicative2);
});

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
  const liftedFn = fmap(Validation.field(key));
  return liftedFn(validator);
}

export function fields1(validatorObj) {
  //if (typeof model !== "object" || model === null) return Validation.Success(); // TBD
  Object.entries(validatorObj)
    .map(([key, validator]) => field(key, validator))
    .map(fmap(Validation._isSuccess))
    .reduce(lift2(logicalAndOperator));
}

export function fields2(validatorObj) {
  return $do(function*() {
    const [model, context] = yield Reader.ask();

    let validationObj = {};
    for (let [key, validator] of Object.entries(validatorObj)) {
      const fieldContext = context && { ...context, fieldPath: [...(context.fieldPath || []), key] };
      const field = model[key];
      if (field === undefined || (context && context.fieldFilter && !context.fieldFilter(fieldContext.fieldPath))) {
        debugPath(fieldContext, "skipped");
      } else {
        validationObj[key] = yield validator.contramap(()=> [field, fieldContext] );
      }
    }
    const fieldsValidation = Validation.fields(validationObj);
    return Validator.of(fieldsValidation);

  });
}

export function fields(validatorObj) {
  return function(model, context) {
    if (typeof model !== "object" || model === null) return Validation.Success(); // TBD

    const [fields, isSuccess] = Object.keys(validatorObj).reduce(
      function([fields, isSuccess], key) {
        const field = model[key];
        const fieldContext = context && { ...context, fieldPath: [...(context.fieldPath || []), key] };

        if (field === undefined || (fieldContext && fieldContext.fieldFilter && !fieldContext.fieldFilter(fieldContext.fieldPath))) {
          debugPath(fieldContext, "skipped");

          fields[key] = Validation.Success();
          return [fields, isSuccess]; // TBD
        }

        const validation = validatorObj[key](field, fieldContext);

        isSuccess =
          isSuccess &&
          Validation.match(validation, {
            Success: _ => true,
            Failure: _ => false
          });

        fields[key] = validation;
        debugPath(fieldContext, isSuccess ? "succeded" : "failed");

        return [fields, isSuccess];
      },
      [{}, true]
    );

    return isSuccess ? Validation.Success(fields) : Validation.Failure([], fields);
  };
}

export function items(itemValidator) {
  return function(model, context) {
    if (!Array.isArray(model)) return Validation.Success(); // TBD

    const [fields, isSuccess] = model.reduce(
      function([fields, isSuccess], item, index) {
        const itemContext = context && { ...context, fieldPath: [...(context.fieldPath || []), index.toString()] };

        if (itemContext && itemContext.fieldFilter && !itemContext.fieldFilter(itemContext.fieldPath)) {
          debugPath(itemContext, "skipped");

          fields[index.toString()] = Validation.Success();
          return [fields, isSuccess];
        }

        const validation = itemValidator(item, itemContext);
        isSuccess =
          isSuccess &&
          Validation.match(validation, {
            Success: _ => true,
            Failure: _ => false
          });

        fields[index.toString()] = validation;

        debugPath(itemContext, isSuccess ? "succeded" : "failed");

        return [fields, isSuccess];
      },
      [{}, true]
    );

    return isSuccess ? Validation.Success(fields) : Validation.Failure([], fields);
  };
}

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
