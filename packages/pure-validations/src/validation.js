// @flow
import { Map, Set, merge, mergeWith } from "immutable";

const isSuccessSymbol = Symbol("_isSuccess");
const errorsSymbol = Symbol("_errors");
const emptySuccess = make(true, {}, []);

export opaque type ValidationType = Map<string, any>;
type Fields = { [key: string]: any };
type Errors = string[];
type KeyPath =
  | []
  | [string]
  | [string, string]
  | [string, string, string]
  | [string, string, string, string]
  | [string, string, string, string, string];

type Matcher<T> = {
  Success: () => T,
  Failure: (fields: Fields, errors: Errors) => T
};

function Success() {
  return emptySuccess;
}

function Failure(errors: Errors, fields: Fields = {}) {
  return make(false, fields, errors);
}

function make(isSuccess: boolean, fields: Fields, errors: Errors): ValidationType {
  return Map(fields).withMutations(map => {
    map.set(isSuccessSymbol, isSuccess).set(errorsSymbol, Set(errors));
  });
}

function match<T>(validation: ValidationType, { Success, Failure }: Matcher<T>): T {
  // $FlowFixMe
  const { [isSuccessSymbol]: isSuccess, [errorsSymbol]: errors, ...fields } = validation.toObject();
  return isSuccess ? Success() : Failure(errors.toArray(), fields);
}

function concat(validation1: ValidationType, validation2: ValidationType): ValidationType {
  return mergeWith(merger, validation1, validation2);
}

function merger(value1, value2, key) {
  return key === isSuccessSymbol
    ? (value1: boolean) && (value2: boolean)
    : key === errorsSymbol
    ? merge((value1: Errors), (value2: Errors))
    : mergeWith(merger, (value1: ValidationType), (value2: ValidationType));
}

function getInner(validation: ValidationType, searchKeyPath: KeyPath): ValidationType {
  return validation.getIn(searchKeyPath) || Success();
}

export const Validation = { Success, Failure, match, concat, getInner };
