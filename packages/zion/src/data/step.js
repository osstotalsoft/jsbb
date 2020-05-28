import { taggedSum } from "daggy";
import * as fl from "fantasy-land";
import { equals, lte } from "ramda";

const Step = taggedSum("Step", {
  Loop: ["value"],
  Done: ["result"]
});

const { Loop, Done } = Step;

/* Setoid (Step b a) */ {
  Step.prototype[fl.equals] = function(that) {
    return this.cata({
      Done: x =>
        that.cata({
          Done: equals(x),
          Loop: _ => false
        }),

      Loop: x =>
        that.cata({
          Done: _ => false,
          Loop: equals(x)
        })
    });
  };
}

/* Ord (Step b a) */ {
  Step.prototype[fl.lte] = function(that) {
    return this.cata({
      Done: x =>
        that.cata({
          Done: lte(x),
          Loop: _ => false
        }),

      Loop: x =>
        that.cata({
          Done: _ => true,
          Loop: lte(x)
        })
    });
  };
}

/* Functor (Step b) */ {
  Step.prototype[fl.map] = function(f) {
    return this.cata({
      Done: _ => this,
      Loop: x => Loop(f(x))
    });
  };
}

/* Bifunctor Step */ {
  Step.prototype[fl.bimap] = function(f, g) {
    return this.cata({
      Done: x => Done(f(x)),
      Loop: x => Loop(g(x))
    });
  };
}

export { Loop, Done };
