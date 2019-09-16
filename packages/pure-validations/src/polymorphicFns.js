import curry from "lodash.curry";

const chain = curry(function chain(fn, ma) {
  return ma['fantasy-land/chain'](fn);
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
  return fnFunctor['fantasy-land/ap'](applicative);
});

const fmap = curry(function fmap(fn, functor) {
  return functor['fantasy-land/map'](fn);
});

const lift2 = curry(function lift2(op, applicative1, applicative2) {
  return ap(fmap(op, applicative1), applicative2);
});


export { chain, $do, ap, fmap, lift2 };
