import { Validation } from "./validation";
import { Validator } from "./validator";
import { $do, chain } from "./polymorphicFns";
import curry from "lodash.curry";

export function first1(...validators) {
  return validators.reduce((f1, f2) =>
    $do(function*() {
      const v1 = yield f1;
      return Validation.isSuccess(v1) ? f2 : Validator.of(v1);
    })
  );
}

export function first(...validators) {
  return validators.reduce((f1, f2) =>
  f1 |> chain(v1 => Validation.isSuccess(v1) ? f2 : Validator.of(v1))
  );
}

export function all(...validators) {
  return validators.reduce((f1, f2) => (model, context) => {
    const v1 = f1(model, context);
    const v2 = f2(model, context);

    return Validation.concat(v1, v2);
  });
}

export function any(...validators) {
  return validators.reduce((f1, f2) => (model, context) => {
    const v1 = f1(model, context);
    const result = Validation.match(v1, {
      Success: _ => v1,
      Failure: _ => {
        const v2 = f2(model, context);
        return Validation.match(v2, {
          Success: _ => v2,
          Failure: _ => Validation.concat(v1, v2)
        });
      }
    });

    return result;
  });
}

export function when(predicate, validator) {
  return (model, context) => {
    if (!predicate(model)) {
      return Validation.Success();
    }

    return validator(model, context);
  };
}

export function withModel(validatorFactory) {
  return (model, context) => {
    return validatorFactory(model)(model, context);
  };
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

        if (!isSuccess) {
          fields[key] = validation;
        }

        debugPath(fieldContext, isSuccess ? "succeded" : "failed");

        return [fields, isSuccess];
      },
      [{}, true]
    );

    return isSuccess ? Validation.Success() : Validation.Failure([], fields);
  };
}

export function items(itemValidator) {
  ``;
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

        if (!isSuccess) {
          fields[index.toString()] = validation;
        }

        debugPath(itemContext, isSuccess ? "succeded" : "failed");

        return [fields, isSuccess];
      },
      [{}, true]
    );

    return isSuccess ? Validation.Success() : Validation.Failure([], fields);
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
