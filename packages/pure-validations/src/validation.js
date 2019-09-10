import { Map, Set, merge, mergeWith } from "immutable";
import curry from "lodash.curry";

const isSuccessSymbol = Symbol("_isSuccess");
const errorsSymbol = Symbol("_errors");
const emptySuccess = make(true, {}, []);

function Success(fields = {}) {
  return Object.keys(fields).length === 0 ? emptySuccess : make(true, fields, []);
}

function Failure(errors, fields = {}) {
  return make(false, fields, errors);
}

function make(isSuccess, fields, errors) {
  return Map(fields).withMutations(map => {
    map.set(isSuccessSymbol, isSuccess).set(errorsSymbol, Set(errors));
  });
}

function match(validation, { Success, Failure }) {
  const { [isSuccessSymbol]: isSuccess, [errorsSymbol]: errors, ...fields } = validation.toObject();
  return isSuccess ? Success(fields) : Failure(errors.toArray(), fields);
}

function mergerAll(value1, value2, key) {
  return key === isSuccessSymbol ? value1 && value2 : key === errorsSymbol ? merge(value1, value2) : mergeWith(mergerAll, value1, value2);
}

function all(validation1, validation2) {
  return mergeWith(mergerAll, validation1, validation2);
}

function mergerAny(value1, value2, key) {
  return key === isSuccessSymbol ? undefined : key === errorsSymbol ? undefined : any(value1, value2);
}

function any(validation1, validation2) {
  const result = mergeWith(mergerAny, validation1, validation2);

  const errors1 = _getErrors(validation1);
  const errors2 = _getErrors(validation2);

  const isSelfSuccess = _isEmpty(errors1) || _isEmpty(errors2);
  const isMergedFieldSuccess = result.reduce((acc, val) => acc && _isSuccess(val), true);

  result.set(isSuccessSymbol, isSelfSuccess && isMergedFieldSuccess);
  result.set(errorsSymbol, isSelfSuccess ? Set([]) : merge(errors1, errors2));

  return result;
}

function mergerReplace(value1, value2, key) {
  return key === isSuccessSymbol ? value2 : key === errorsSymbol ? value2 : mergeWith(mergerReplace, value1, value2);
}

function replace(validation1, validation2) {
  return mergeWith(mergerReplace, validation1, validation2);
}

//field:: string -> validation -> validation
const field = curry(function field(key, validation) {
  return make(_isSuccess(validation), { [key]: validation }, []);
});

function fields(validationObj) {
  Object.entries(validationObj).reduce(([k1, v1], [k2, v2]) => all(field(k1, v1), field(k2, v2)), Success());
}

function getInner(validation, searchKeyPath) {
  return validation.getIn(searchKeyPath) || Success();
}

function _isEmpty(errors) {
  return !errors || !Set.isSet(errors) || errors.isEmpty();
}

function _isSuccess(validation) {
  return validation.get(isSuccessSymbol) || true;
}

function _getErrors(validation) {
  return validation.get(errorsSymbol) || Set([]);
}

export const Validation = { Success, Failure, match, all, any, replace, field, fields, getInner, _isSuccess, _getErrors };
