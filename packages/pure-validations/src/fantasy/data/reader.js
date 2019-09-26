import { tagged } from "daggy";
import fl from "fantasy-land";
import { $do, concat } from "../prelude";

const Reader = tagged("Reader", ["computation"]);
Reader[fl.of] = x => Reader(_ => x); // Monad, Applicative
Reader.ask = () => Reader((...props) => props); // Reader

/* Reader */ {
  Reader.prototype.runReader = function runReader(...props){
    return this.computation(...props);
  }
}

/* Functor Reader */ {
  Reader.prototype[fl.map] = function(f) {
    return Reader((...props) => f(this.computation(...props)));
  };
}

/* Apply Reader */ {
  Reader.prototype[fl.ap] = function(that) {
    return Reader((...props) => that.computation(...props)(this.computation(...props)));
  };
}

/* Chain Reader */ {
  Reader.prototype[fl.chain] = function(f) {
    return Reader((...props) => f(this.computation(...props)).computation(...props));
  };
}

/* Contravariant Reader */ {
  Reader.prototype[fl.contramap] = function(f) {
    return Reader((...props) => this.computation(...f(...props)));
  };
}

/* Contravariant Reader */ {
  Reader.prototype.toString = function() {
    return `Reader(${this.computation})`;
  };
}

/* Semigroup a => Semigroup (Reader a) */ {
  Reader.prototype[fl.concat] = function(that) {
    const self = this;
    return $do(function*() {
      const x1 = yield self;
      const x2 = yield that;
      return Reader[fl.of](concat(x1, x2));
    });
  };
}

export default Reader;
