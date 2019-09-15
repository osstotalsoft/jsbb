import { Semigroup } from "./typeClasses";

const Maybe = {};

const nothingPrototype = {
  isNothing: true,
  isJust: false,
  constructor: Maybe,
  "fantasy-land/concat": function(other) {
    return other;
  }
};

const justPrototype = {
  isNothing: false,
  isJust: true,
  constructor: Maybe
};

const justSemigroupPrototype = {
  ...justPrototype,
  "fantasy-land/concat": function(other) {
    return other.isJust ? Just(this.value["fantasy-land/concat"](other.value)) : this;
  }
};

const nothing = Object.create(nothingPrototype);

function Nothing() {
  return nothing;
}

function Just(value) {
  const prototype = Semigroup.check(value) ? justSemigroupPrototype : justPrototype;

  const just = Object.assign(Object.create(prototype), {
    value
  });

  return just;
}

export { Nothing, Just, Maybe };
