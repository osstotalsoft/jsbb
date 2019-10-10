import { taggedSum } from "daggy";
import fl from "fantasy-land";

import { Loop, Done } from "./step";
import { equals, lte, map, concat } from "ramda";

//- The `Maybe` type is used to model "nullable" values in a type-
//- safe way. Instead of returning a value OR null, return a Just
//- value OR Nothing. Why? Because these two values have **the same
//- interface**, which means that you can treat them in the same way.
//- When you want to get a value _out_, you must also deal with the
//- Nothing case, which prevents you from forgetting about it.

const Maybe = taggedSum("Maybe", { Just: ["value"], Nothing: [] });

const { Just, Nothing } = Maybe;

/* Setoid a => Setoid (Maybe a) */ {
  Maybe.prototype[fl.equals] = function(that) {
    return this.cata({
      Just: x =>
        that.cata({
          Just: equals(x),
          Nothing: () => false
        }),

      Nothing: () => Nothing.is(that)
    });
  };
}

/* Ord a => Ord (Maybe a) */ {
  Maybe.prototype[fl.lte] = function(that) {
    return this.cata({
      Just: x =>
        that.cata({
          Just: lte(x),
          Nothing: () => false
        }),

      Nothing: () => true
    });
  };
}

/* Semigroup a => Semigroup (Maybe a) */ {
  Maybe.prototype[fl.concat] = function(that) {
    // return this.cata({
    //   Just: x => that |> map(concat(x)),
    //   Nothing: () => that
    // })
    return this.cata({
      Just: x =>
        that.cata({
          Just: y => {
            const concatValue = concat(x, y);
            return concatValue !== x ? Just(concatValue) : this;
          },
          Nothing: () => this
        }),
      Nothing: () => that
    });
  };
}

/* Monoid a => Monoid (Maybe a) */ {
  Maybe[fl.empty] = () => Nothing;
}

/* Functor Maybe */ {
  Maybe.prototype[fl.map] = function(f) {
    return this.cata({
      Just: x => Just(f(x)),
      Nothing: () => this
    });
  };
}

/* Apply Maybe */ {
  Maybe.prototype[fl.ap] = function(fn) {
    return this.cata({
      Just: x => fn |> map(f => f(x)),
      Nothing: () => this
    });
  };
}

/* Applicative Maybe */ {
  Maybe[fl.of] = Just;
}

/* Alt Maybe */ {
  Maybe.prototype[fl.alt] = function(that) {
    return this.cata({
      Just: _ => this,
      Nothing: () => that
    });
  };
}

/* Plus Maybe */ {
  Maybe[fl.zero] = Nothing;
}

/* Alternative Maybe */

/* Foldable Maybe */ {
  Maybe.prototype[fl.reduce] = function(f, acc) {
    return this.cata({
      Just: x => f(acc, x),
      Nothing: acc
    });
  };
}

/* Traversable Maybe */ {
  Maybe.prototype[fl.traverse] = function(T, f) {
    return this.cata({
      Just: x => f(x) |> map(Just),
      Nothing: () => T[fl.of](this)
    });
  };
}

/* Chain Maybe */ {
  Maybe.prototype[fl.chain] = function(f) {
    return this.cata({
      Just: f,
      Nothing: () => this
    });
  };
}

/* Trainwreck Maybe */ {
  Maybe.trainwreck = function(f, init) {
    let acc = Loop(Just(init));

    do {
      acc.loop instanceof Nothing ? (acc = Done(Nothing)) : (acc = f(acc.loop.value));
    } while (acc instanceof Loop);

    return acc.result;
  };
}

/* ChainRec Maybe */ {
  Maybe[fl.chainRec] = function(f, init) {
    let acc = Loop(Just(init));

    do {
      acc.loop instanceof Nothing ? (acc = Done(acc.loop)) : (acc = f(Done, Loop, acc.loop.value));
    } while (acc instanceof Loop);

    return acc.result;
  };
}

// eslint-disable-next-line no-empty
/* Monad Maybe */ {
}

/* Extend Maybe */ {
  Maybe[fl.extend] = function(f) {
    return this.cata({
      Just: _ => Just(f(this)),
      Nothing: () => Nothing
    });
  };
}

export default Maybe;
