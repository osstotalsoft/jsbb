import fl from "fantasy-land";
import immutagen from "immutagen";
import { chain, reduce, concat, curry } from "ramda";

function $do(gen) {
  const doNext = (next, pure) => input => {
    const { value, next: nextNext } = next(input);

    if (!nextNext) {
      return pure(value);
    }

    return chain(doNext(nextNext, value.constructor[fl.of]), value);
  };
  return doNext(immutagen(gen))();
}

// contramap :: Contravariant f => (b -> a) -> f a -> f b
const contramap = curry(function contramap(fn, contravariant) {
  return contravariant[fl.contramap](fn);
});

// fold :: Monoid m, Foldable f => (a -> m a) -> f a -> m a
const fold = M => xs => xs |> reduce((acc, x) => concat(acc, M(x)), M[fl.empty]());

export { $do, contramap, fold };
