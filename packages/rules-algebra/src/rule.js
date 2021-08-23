// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { checkRules } from "./_utils"
import { curry } from "ramda";
import * as fl from "fantasy-land";
import { tagged } from "daggy";
import { $do } from "@totalsoft/zion/prelude";
import { concat } from "ramda";

export const Rule = tagged("Rule", ["computation"]);
Rule[fl.of] = x => Rule(_ => x); // Monad, Applicative
Rule.ask = () => Rule((model, ctx) => [model, ctx]); // Reader

/* Rule */ {
    Rule.prototype.runRule = function runRule(model, ctx){
    return this.computation(model, ctx);
  }
}

/* Functor Rule */ {
    Rule.prototype[fl.map] = function(f) {
    return Rule((model, ctx) => f(this.computation(model, ctx)));
  };
}

/* Apply Rule */ {
    Rule.prototype[fl.ap] = function(fn) {
    return Rule((model, ctx) => fn.computation(model, ctx)(this.computation(model, ctx)));
  };
}

/* Chain Rule */ {
    Rule.prototype[fl.chain] = function(f) {
    return Rule((model, ctx) => f(this.computation(model, ctx)).computation(model, ctx));
  };
}

/* Contravariant Reader */ {
    Rule.prototype[fl.contramap] = function(f) {
    return Rule((model, ctx) => this.computation(...f(model, ctx)));
  };
}

/* Show Rule */ {
    Rule.prototype.toString = function() {
    return `Rule(${this.computation})`;
  };
}

/* Semigroup a => Semigroup (Rule a) */ {
    Rule.prototype[fl.concat] = function(that) {
    const self = this;
    return $do(function*() {
      const x1 = yield self;
      const x2 = yield that;
      return concat(x1, x2);
    });
  };
}

Rule.of = Rule[fl.of];

const emptyContext = {
    prevDocument: undefined,
    document: undefined,
    fieldPath: [],
    scopePath: [],
    log: false,
    logger: { log: () => { } },
};

export const applyRule = curry(function applyRule(rule, newModel, prevModel = undefined, ctx = undefined) {
    checkRules(rule)
    return rule.runRule(newModel, { ...emptyContext, ...ctx, prevModel, document: newModel, prevDocument: prevModel });
});
