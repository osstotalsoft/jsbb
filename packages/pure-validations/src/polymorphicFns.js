import curry from "lodash.curry";
import fl from 'fantasy-land'

const chain = curry(function chain(fn, ma) {
  return ma[fl.chain](fn);
});

function $do(gen) {
  let g = gen(); // Will need to re-bind generator when done.
  const step = value => {
    const result = g.next(value);
    if (result.done) {
      g = gen();
      return result.value;
    } else {
      return chain(step, result.value);
    }
  };
  return step();
}

const ap = curry(function apply(fnFunctor, applicative) {
  return fnFunctor[fl.ap](applicative);
});

const fmap = curry(function fmap(fn, functor) {
  return functor[fl.map](fn);
});

const contramap = curry(function contramap(fn, contravariant) {
  return contravariant[fl.contramap](fn);
});

const lift2 = curry(function lift2(op, applicative1, applicative2) {
  return ap(fmap(op, applicative1), applicative2);
});

const concat = curry(function concat(s1, s2) {
  return s1[fl.concat](s2);
})


export { chain, $do, ap, fmap, lift2, concat, contramap };
