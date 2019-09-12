import { Map, Set, merge, mergeWith } from "immutable";
import curry from "lodash.curry";
import { fail } from "assert";
import { type } from "os";

const successType = 'Success';
const failureType = 'Failure';
const skippedType = 'Skipped';

const typeSymbol = Symbol("_type");
const errorsSymbol = Symbol("_errors");
const emptySuccess = make(successType, {}, []);
const emptySkipped = make(skippedType, {}, []);

function make(type, fields, errors) {
  return Map(fields).withMutations(map => {
    map.set(typeSymbol, type).set(errorsSymbol, Set(errors));
  });
}

function Success(fields = {}) {
  return Object.keys(fields).length === 0 ? emptySuccess : make(successType, fields, []);
}

function Failure(errors, fields = {}) {
  return make(failureType, fields, errors);
}

function Skipped(fields = {}) {
  return Object.keys(fields).length === 0 ? emptySkipped: make(skippedType, fields, []);
}

function match(validation, { Success, Failure, Skipped }) {
  const { [typeSymbol]: type, [errorsSymbol]: errors, ...fields } = validation.toObject();
  switch (type) {
    case successType:
      return Success(fields)
    case failureType:
      return Failure(errors.toArray(), fields)
    case skippedType:
      return Skipped(fields)
  }
}

function mergeTypes(op) {
  return function (type1, type2, ) {
    if (type1 === skippedType) {
      return type2;
    }
    if (type2 === skippedType) {
      return type1;
    }
    if (op(type1 === successType, type2 === successType)) {
      return successType;
    }
    return failureType;
  }
}

function and(a, b) {
  return a && b;
}

function or(a, b) {
  return a || b;
}

function mergerAll(value1, value2, key) {
  switch (key) {
    case typeSymbol:
      return mergeTypes(and)(value1, value2)
    case errorsSymbol:
      return merge(value1, value2)
    default:
      return mergeWith(mergerAll, value1, value2)
  }
}

const all = curry(function all(validation1, validation2) {
  return mergeWith(mergerAll, validation1, validation2);
})

function mergerAny(value1, value2, key) {
  switch (key) {
    case typeSymbol:
    case errorsSymbol:
      return undefined
    default:
      return any(value1, value2)
  }
}

const any = curry(function any(validation1, validation2) {
  let result = mergeWith(mergerAny, validation1, validation2);

  const errors1 = _getErrors(validation1);
  const errors2 = _getErrors(validation2);

  const isSelfSuccess = _isEmpty(errors1) || _isEmpty(errors2);
  const mergedFieldsType = result.map(_getType).reduce(mergeTypes(and), isSelfSuccess ? successType : failureType);

  result = result
    .set(typeSymbol, mergedFieldsType)
    .set(errorsSymbol, isSelfSuccess ? Set([]) : merge(errors1, errors2));

  return result;
})

function mergerReplace(value1, value2, key) {
  return key === isSuccessSymbol ? value2 : key === errorsSymbol ? value2 : mergeWith(mergerReplace, value1, value2);
}

function replace(validation1, validation2) {
  return mergeWith(mergerReplace, validation1, validation2);
}

//field:: string -> validation -> validation
const field = curry(function field(key, validation) {
  return make(_getType(validation), { [key]: validation }, []);
});

function getInner(validation, searchKeyPath) {
  return validation.getIn(searchKeyPath) || Skipped();
}

function _isEmpty(errors) {
  return !errors || !Set.isSet(errors) || errors.isEmpty();
}

function _isSuccess(validation) {
  return validation.get(typeSymbol) == successType;
}

function _isFailure(validation) {
  return validation.get(typeSymbol) == failureType;
}

function _isSkipped(validation) {
  return validation.get(typeSymbol) == skippedType;
}

function _getErrors(validation) {
  return validation.get(errorsSymbol) || Set([]);
}

function _getType(validation) {
  if (!validation)
    return skippedType;

  return validation.get(typeSymbol) || skippedType;
}

export const Validation = { Success, Failure, Skipped, match, all, any, replace, field, getInner, _isSuccess, _isFailure, _getErrors, _getType };
