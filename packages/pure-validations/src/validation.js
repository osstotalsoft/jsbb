import { Map, Set, merge, mergeWith } from "immutable";

const isSuccessSymbol = Symbol("_isSuccess");
const errorsSymbol = Symbol("_errors");
const emptySuccess = make(true, {}, []);

function Success(fields = {}) {
  return Object.keys(fields).length === 0 ? emptySuccess : make(true, fields, []);;
}

function Failure(errors, fields = {}) {
  return make(false, fields, errors);
}

function make(isSuccess, fields, errors){
  return Map(fields).withMutations(map => {
    map.set(isSuccessSymbol, isSuccess).set(errorsSymbol, Set(errors));
  });
}

function match(validation, { Success, Failure }) {
  const { [isSuccessSymbol]: isSuccess, [errorsSymbol]: errors, ...fields } = validation.toObject();
  return isSuccess ? Success(fields) : Failure(errors.toArray(), fields);
}

function concat(validation1, validation2) {
  return mergeWith(merger, validation1, validation2);
}

function merger(value1, value2, key) {
  return key === isSuccessSymbol
    ? value1 && value2
    : key === errorsSymbol
    ? merge(value1, value2)
    : mergeWith(merger, value1, value2);
}

function getInner(validation, searchKeyPath){
  return validation.getIn(searchKeyPath) || Success();
}

function isSuccess(validation) {
  return Validation.match(validation, {
    Success: _ => true,
    Failure: _ => false
  });
}

export const Validation = { Success, Failure, match, concat, getInner, isSuccess };
