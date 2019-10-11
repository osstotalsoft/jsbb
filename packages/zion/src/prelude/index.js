import fl from "fantasy-land";
import immutagen from "immutagen";
import { chain, reduce, concat, curry, always } from "ramda";

function $do(gen) {
  const doNext = (next, typeRep) => input => {
    const { value, next: nextNext } = next(input);

    if (!nextNext) {
      return pure(typeRep)(value);
    }

    return chain(doNext(nextNext, value.constructor), value);
  };
  return doNext(immutagen(gen))();
}

// pure :: Applicative f => TypeRep f -> a -> f a
const pure = function(A) {
  if (A[fl.of]) {
    return A[fl.of];
  }
  if (A === Array) {
    return A.of;
  }
  if (A === Function) {
    return always;
  }
  return A[fl.of] || A.of;
};

// contramap :: Contravariant f => (b -> a) -> f a -> f b
const contramap = curry(function contramap(fn, contravariant) {
  return contravariant[fl.contramap](fn);
});

// fold :: Monoid m, Foldable f => (a -> m a) -> f a -> m a
const fold = curry(function(M, xs) {
  return xs |> reduce((acc, x) => concat(acc, M(x)), M[fl.empty]());
});

export { $do, pure, contramap, fold };
