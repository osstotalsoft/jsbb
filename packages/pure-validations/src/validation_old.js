import { Map, Set, merge, mergeWith } from "immutable";
import curry from "lodash.curry";

const isSuccessSymbol = Symbol("_isSuccess");
const errorsSymbol = Symbol("_errors");
const emptySuccess = make(true, {}, []);

function make(isSuccess, fields, errors) {
  return Map(fields).withMutations(map => {
    map.set(isSuccessSymbol, isSuccess).set(errorsSymbol, Set(errors));
  });
}

function Success() {
  return emptySuccess;
}

function Failure(errors, fields = {}) {
  return make(false, fields, errors);
}

function match(validation, { Success, Failure }) {
  const { [isSuccessSymbol]: isSuccess, [errorsSymbol]: errors, ...fields } = validation.toObject();
  return isSuccess ? Success() : Failure(errors.toArray(), fields);
}


function mergerAll(value1, value2, key) {
  switch (key) {
    case isSuccessSymbol:
      return value1 && value2
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
    case isSuccessSymbol:
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
  const mergedFieldsSuccess = result.reduce((acc, v) => acc && _isSuccess(v), isSelfSuccess);

  result = result
    .set(isSuccessSymbol, mergedFieldsSuccess)
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
/*const field = curry(function field(key, validation) {
  return make(_getType(validation), { [key]: validation }, []);
});*/

function getInner(validation, searchKeyPath) {
  return validation.getIn(searchKeyPath) || Success();
}

function _isEmpty(errors) {
  return !errors || !Set.isSet(errors) || errors.isEmpty();
}

function _isSuccess(validation) {
  if (!validation) {
    return true;
  }
    
  return validation.get(isSuccessSymbol) === true;
}

function _isFailure(validation) {
  return validation.get(isSuccessSymbol) === false;
}

function _getErrors(validation) {
  return validation.get(errorsSymbol) || Set([]);
}

export const Validation = { Success, Failure, match, all, any, replace, getInner, _isSuccess, _isFailure, _getErrors };
