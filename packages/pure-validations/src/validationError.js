import { Map, Set, merge, mergeWith } from "immutable";
import { Semigroup } from "./typeClasses";
const errorsSymbol = Symbol("_errors");

function mergerAll(value1, value2, key) {
  switch (key) {
    case errorsSymbol:
      return merge(value1, value2);
    default:
      return mergeWith(mergerAll, value1, value2);
  }
}

const validationErrorPrototype = {
  "fantasy-land/concat": function(other) {
    const mergedErrors = mergeWith(mergerAll, this, other);
    return Object.assign(mergedErrors, validationErrorPrototype);
  },
  getErrors: function() {
    return this.get(errorsSymbol).toArray();
  },
  getField: function(key) {
    return this.get(key);
  },
  getFields: function() {
    // eslint-disable-next-line no-unused-vars
    const { [errorsSymbol]: _, ...fields } = this.toObject();
    return fields;
  },
  toString: function() {
    const errors = this.getErrors();
    const fields = Object.entries(this.getFields())
      .reduce((acc, [k, v]) => `${acc} \n ${k}: ${v}`, "");

    return `errors: ${errors} \n fields: {${fields}\n}`;
  }
};

export function ValidationError(errors, fields) {
  //const validationError = Object.create(validationErrorPrototype);

  const map = Map(fields).withMutations(map => {
    map.set(errorsSymbol, Set(errors));
  });

  return Object.assign(map, validationErrorPrototype);
}

if (!Semigroup.check(validationErrorPrototype)) {
  throw "Validation error is not a semigroup";
}
