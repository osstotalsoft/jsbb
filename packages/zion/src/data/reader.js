// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { tagged } from "daggy";
import * as fl from "fantasy-land";
import { $do } from "../prelude";
import { concat } from "ramda";

const Reader = tagged("Reader", ["computation"]);
Reader[fl.of] = x => Reader(_ => x); // Monad, Applicative
Reader.ask = () => Reader(ctx => ctx); // Reader

/* Reader */ {
  Reader.prototype.runReader = function runReader(ctx){
    return this.computation(ctx);
  }

  Reader.prototype.local = function(f) {
    return Reader(ctx => this.computation(f(ctx)));
  };

  Reader.prototype.toString = function() {
    return `Reader(${this.computation})`;
  };
}

/* Functor Reader */ {
  Reader.prototype[fl.map] = function(f) {
    return Reader(ctx => f(this.computation(ctx)));
  };
}

/* Apply Reader */ {
  Reader.prototype[fl.ap] = function(fn) {
    return Reader(ctx => fn.computation(ctx)(this.computation(ctx)));
  };
}

/* Chain Reader */ {
  Reader.prototype[fl.chain] = function(f) {
    return Reader(ctx => f(this.computation(ctx)).computation(ctx));
  };
}

/* Contravariant Reader */ {
  Reader.prototype[fl.contramap] = function(f) {
    return Reader(ctx => this.computation(f(ctx)));
  };
}

/* Semigroup a => Semigroup (Reader a) */ {
  Reader.prototype[fl.concat] = function(that) {
    const self = this;
    return $do(function*() {
      const x1 = yield self;
      const x2 = yield that;
      return concat(x1, x2);
    });
  };
}

export default Reader;
