import { Monad } from "./typeClasses";
import fl from "fantasy-land";

Reader[fl.of] = x => Reader(_ => x); // Monad, Applicative
Reader.ask = () => Reader((...props) => props); // Reader
Reader.check = function(x) {
  return Object.getPrototypeOf(x) === proto;
};

const proto = {
  constructor: Reader,
  [fl.chain]: function(f) {
    return Reader((...props) => f(this.runReader(...props)).runReader(...props));
  }, // Monad, Chain
  [fl.contramap]: function(f) {
    return Reader((...props) => this.runReader(...f(...props)));
  }, // Contravariant
  toString: function() {
    return `Reader(${this.runReader})`;
  },
  ...Monad.derive()
};

function Reader(computation) {
  return Object.assign(Object.create(proto), {
    runReader: computation // Reader
  });
}

export { Reader };
