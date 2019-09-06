import curry from "lodash.curry";

const chain = curry(function chain(fn, ma) {
  return ma.chain(fn);
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

export { chain, $do };
