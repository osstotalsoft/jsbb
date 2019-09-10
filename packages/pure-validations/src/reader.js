function Reader(computation) {
  return {
    runReader: (...props) => computation(...props),
    map: f => Reader((...props) => f(computation(...props))),
    contramap: f => Reader((...props) => computation(...f(...props))),
    ap: other =>
      Reader((...props) => {
        const fn= computation(...props);
        return fn(other.runReader(...props));
      }),
    chain: f => {
      return Reader((...props) => {
        // Get the result from original computation
        const a = computation(...props);

        // Now get the result from the computation
        // inside the Reader `f(a)`.
        return f(a).runReader(...props);
      });
    }
  };
}

Reader.of = x => Reader(_ => x);
Reader.ask = () => Reader((...props) => props);

export { Reader };
