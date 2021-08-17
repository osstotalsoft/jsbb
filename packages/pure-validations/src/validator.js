import { checkValidators } from "./higherOrderValidators/_utils";
import { curry } from "ramda";
import * as fl from "fantasy-land";
import { tagged } from "daggy";
import { $do } from "@totalsoft/zion/prelude";
import { concat } from "ramda";


const Validator = tagged("Validator", ["computation"]);
Validator[fl.of] = x => Validator(_ => x); // Monad, Applicative
Validator.ask = () => Validator((model, ctx) => [model, ctx]); // Reader

/* Validator */ {
  Validator.prototype.runValidator = function runValidator(model, ctx) {
    return this.computation(model, ctx);
  }
}

/* Functor Validator */ {
  Validator.prototype[fl.map] = function (f) {
    return Validator((model, ctx) => f(this.computation(model, ctx)));
  };
}

/* Apply Validator */ {
  Validator.prototype[fl.ap] = function (fn) {
    return Validator((model, ctx) => fn.computation(model, ctx)(this.computation(model, ctx)));
  };
}

/* Chain Validator */ {
  Validator.prototype[fl.chain] = function (f) {
    return Validator((model, ctx) => f(this.computation(model, ctx)).computation(model, ctx));
  };
}

/* Contravariant Reader */ {
  Validator.prototype[fl.contramap] = function (f) {
    return Validator((model, ctx) => this.computation(...f(model, ctx)));
  };
}

/* Show Validator */ {
  Validator.prototype.toString = function () {
    return `Validator(${this.computation})`;
  };
}

/* Semigroup a => Semigroup (Validator a) */ {
  Validator.prototype[fl.concat] = function (that) {
    const self = this;
    return $do(function* () {
      const x1 = yield self;
      const x2 = yield that;
      return concat(x1, x2);
    });
  };
}

Validator.of = Validator[fl.of];

const emptyContext = {
  fieldPath: [],
  fieldFilter: _ => true,
  log: false,
  logger: { log: () => { } },
  parentModel: null,
  parentContext: null
};

const validate = curry(function validate(validator, model, ctx = undefined) {
  checkValidators(validator);
  return validator.runValidator(model, { ...emptyContext, ...ctx });
});

export { Validator, validate };
