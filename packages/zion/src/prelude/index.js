import curry from "lodash.curry";
import fl from "fantasy-land";

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

//+ eq :: Setoid a => a -> a -> Bool
const eq = curry(function eq(x, y) {
  if (typeof x === typeof y && ["string", "number"].includes(typeof x)) {
    return x === y;
  }
  if (typeof x[fl.equals] !== "function") {
    console.log(x);
  }
  return x[fl.equals](y);
});

const lte = curry(function eq(x, y) {
  if (typeof x === typeof y && ["string", "number"].includes(typeof x)) {
    return x <= y;
  }
  if (typeof x[fl.lte] !== "function") {
    console.log(x);
  }
  return x[fl.lte](y);
});

// chain :: Chain m => (a -> m b) -> m a -> m b
const chain = curry(function chain(fn, ma) {
  return ma[fl.chain](fn);
});

// ap :: Apply f => f (a -> b) -> f a -> f b
const ap = curry(function ap(fnFunctor, applicative) {
  return applicative[fl.ap](fnFunctor);
});

// map :: Functor f => (a -> b) -> f a -> f b
const map = curry(function map(fn, functor) {
  return functor[fl.map](fn);
});

// contramap :: Contravariant f => (b -> a) -> f a -> f b
const contramap = curry(function contramap(fn, contravariant) {
  return contravariant[fl.contramap](fn);
});

// lift2 :: Apply f => (a -> b -> c) -> f a -> f b -> f c
const lift2 = curry(function lift2(op, applicative1, applicative2) {
  return ap(applicative1 |> map(op), applicative2);
});

// concat :: Semigroup s => s -> s -> s
const concat = curry(function concat(s1, s2) {
  return s1[fl.concat](s2);
});

// fold :: Monoid m => (a -> m) -> [a] -> m
const fold = M => xs => xs.reduce((acc, x) => acc[fl.concat](M(x)), M[fl.empty]());

// merge :: Semigroup s => { to: a -> s a, from: s a -> a} -> a -> a -> a
const merge = curry(function merge(strategy, a, b) {
  return strategy.from(strategy.to(a)[fl.concat](strategy.to(b)));
});

// traverse :: (Traversable t, Applicative f) => TypeRep f -> (a -> f b) -> t a -> f (t b)
const traverse = curry(function traverse(T, f, xs) {
  return xs[fl.traverse](T, f);
});

// empty :: Monoid a => TypeRep a -⁠> a
const empty = M => M[fl.empty]();

// reduce :: Foldable f => (b -> a -> b) -> b -> f a -> b
const reduce = curry(function reduce(reducer, acc, xs) {
  return xs[fl.reduce](reducer, acc);
});

//id :: a -> a
function id(x) {
  return x;
}

//constant :: a -> (b -> a)
function constant(k) {
  return _ => k;
}

//compose :: (b -> c) -> (a -> b) -> a -> c
const compose = curry(function compose(f, g, x) {
  return f(g(x));
})

export { eq, lte, chain, $do, ap, map, lift2, concat, contramap, fold, merge, traverse, empty, reduce, id, constant, compose };
