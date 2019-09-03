// @flow
import { Validation } from "./validation";
import type { ValidationType } from "./validation";
import curry from "lodash.curry";

type Validator<TModel> = (model: TModel, context?: { [key: string]: any }) => ValidationType;

export function first<TModel>(...validators: Validator<TModel>[]): Validator<TModel> {
  return validators.reduce((f1, f2) => (model, context) => {
    const v1 = f1(model, context);
    const result = Validation.match(v1, {
      Success: _ => f2(model, context),
      Failure: _ => v1
    });

    return result;
  });
}

export function all<TModel>(...validators: Validator<TModel>[]): Validator<TModel> {
  return validators.reduce((f1, f2) => (model, context) => {
    const v1 = f1(model, context);
    const v2 = f2(model, context);

    return Validation.concat(v1, v2);
  });
}

export function any<TModel>(...validators: Validator<TModel>[]): Validator<TModel> {
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

export function when<TModel>(predicate: TModel => boolean, validator: Validator<TModel>): Validator<TModel> {
  return (model, context) => {
    if (!predicate(model)) {
      return Validation.Success();
    }

    return validator(model, context);
  };
}

export function withModel<TModel>(validatorFactory: TModel => Validator<TModel>): Validator<TModel> {
  return (model, context) => {
    return validatorFactory(model)(model, context);
  };
}

export function fields<TModel: { [key: string]: any }>(validatorObj: $ObjMap<TModel, <V>(V) => Validator<V>>): Validator<TModel> {
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

export function items<TItem>(itemValidator: Validator<TItem>): Validator<TItem[]> {
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

export const dirtyFieldsOnly = curry(function dirtyFieldsOnly<TDirtyFields: { [key: string]: any }, TModel>(
  dirtyFields: TDirtyFields,
  validator: Validator<TModel>
): Validator<TModel> {
  return function(model, context) {
    const dirtyFieldsContext = { ...context, fieldFilter: path => getInnerProp(path, dirtyFields) };
    return validator(model, dirtyFieldsContext);
  };
});

export function debug<TModel>(validator: Validator<TModel>): Validator<TModel> {
  return function(model, context) {
    const debugContext = { ...context, debug: true, debugFn: console.log };
    return validator(model, debugContext);
  };
}

function getInnerProp(searchKeyPath: Array<string>, obj: { [key: string]: any }) {
  const [prop, ...rest] = searchKeyPath;
  return prop ? getInnerProp(rest, obj[prop]) : obj;
}

function debugPath(context?: { [key: string]: any }, message) {
  if (context && context.debug && context.debugFn) {
    context.debugFn(`Validation ${message} for path ${context.fieldPath.reduce((x, y) => x + "." + y)}`);
  }
}
