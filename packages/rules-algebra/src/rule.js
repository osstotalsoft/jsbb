import { checkRules } from "./_utils"
import { curry } from "ramda";
import * as fl from "fantasy-land";
import { tagged } from "daggy";
import { $do } from "@totalsoft/zion/prelude";
import { concat } from "ramda";

export const Rule = tagged("Rule", ["computation"]);
Rule[fl.of] = x => Rule(_ => x); // Monad, Applicative
Rule.ask = () => Rule((...props) => props); // Reader

/* Rule */ {
    Rule.prototype.runRule = function runRule(...props){
    return this.computation(...props);
  }
}

/* Functor Rule */ {
    Rule.prototype[fl.map] = function(f) {
    return Rule((...props) => f(this.computation(...props)));
  };
}

/* Apply Rule */ {
    Rule.prototype[fl.ap] = function(fn) {
    return Rule((...props) => fn.computation(...props)(this.computation(...props)));
  };
}

/* Chain Rule */ {
    Rule.prototype[fl.chain] = function(f) {
    return Rule((...props) => f(this.computation(...props)).computation(...props));
  };
}

/* Contravariant Reader */ {
    Rule.prototype[fl.contramap] = function(f) {
    return Rule((...props) => this.computation(...f(...props)));
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
