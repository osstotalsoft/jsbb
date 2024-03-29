// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { taggedSum } from "daggy";
import * as fl from "fantasy-land";
import { equals, ap, lift, concat } from "ramda";

//- List is basically the same as `Array`, though much easier for our
//- examples. If one of the methods in Prototype/Array looks
//- frightening, take a look at the same method here: all the `Array`
//- methods act in the exact same way, but `List` is much clearer!

const List = taggedSum("List", {
  Cons: ["head", "tail"],
  Nil: []
});

const { Cons, Nil } = List;

//- Stack-safe List-to-Array natural transformation.
//+ toArray :: List a ~> Array a
List.toArray = function(list) {
  const result = [];
  let start = list;

  while (Cons.is(start)) {
    result.push(start.head);
    start = start.tail;
  }

  return result;
};

//- NOT!!!! Stack-safe List-to-Array natural transformation.
//+ toArray :: List a ~> Array a
List.fromArray = function(arr) {
  if (arr.length == 0) {
    return Nil;
  }
  const [head, ...tail] = arr;
  return Cons(head, List.fromArray(tail));
};

/* Setoid a => Setoid (List a) */ {
  List.prototype[fl.equals] = function(that) {
    return this.cata({
      Cons: (head, tail) => {
        return equals(head, that.head) && tail[fl.equals](that.tail);
      },

      Nil: () => {
        return that.is(Nil);
      }
    });
  };
}

/* Ord a => Ord (List a) */ {
  List.prototype[fl.lte] = function(that) {
    return this.cata({
      Cons: (head, tail) => head[fl.lte](that.head) || tail[fl.lte](that.tail),

      Nil: () => true
    });
  };
}

/* Semigroup List */ {
  List.prototype[fl.concat] = function(that) {
    return this.cata({
      Cons: (head, tail) => Cons(head, tail[fl.concat](that)),
      Nil: () => that
    });
  };
}

/* Monoid List */ {
  List[fl.empty] = () => Nil;
}

/* Functor List */ {
  List.prototype[fl.map] = function(f) {
    return this.cata({
      Cons: (head, tail) => Cons(f(head), tail[fl.map](f)),

      Nil: () => Nil
    });
  };
}

/* Apply List */ {
  List.prototype[fl.ap] = function(fn) {
    return this.cata({
      Cons: (head, tail) => concat(head |> ap(fn), tail[fl.ap](fn)),

      Nil: () => Nil
    });
  };
}

/* Applicative List */ {
  List[fl.of] = x => Cons(x, Nil);
}

/* Alt List */ {
  List.prototype[fl.alt] = List.prototype[fl.concat];
}

/* Plus List */ {
  List.prototype[fl.zero] = List.prototype[fl.empty];
}

// /* Alternative List */ {
// }

/* Foldable List */ {
  List.prototype[fl.reduce] = function(f, acc) {
    return this.cata({
      Cons: (head, tail) => tail[fl.reduce](f, f(acc, head)),
      Nil: () => acc
    });
  };
}

/* Traversable List */ {
  List.prototype[fl.traverse] = function(T, f) {
    return this.cata({
      Cons: (head, tail) => lift(x => y => Cons(x, y), f(head), tail[fl.traverse](T, f)),

      Nil: () => T.of(Nil)
    });
  };
}

/* Chain List */ {
  List.prototype[fl.chain] = function(f) {
    return this[fl.map](f)[fl.reduce](concat, Nil);
  };
}

/* Trainwreck List */ {
  List.trainwreck = function(f, init) {
    return this.toArray()
      .trainwreck(f, init)
      .toList();
  };
}

// /* ChainRec List */ {
//   List[fl.chainRec] = function(f, init) {
//     return this.toArray()[fl.chainRec](f, init)
//       .toList();
//   };
// }

/* Extend List */ {
  List.prototype[fl.extend] = function(f) {
    return this.cata({
      Just: (head, tail) => Cons(f(this), tail[fl.extend](f)),
      Nothing: () => Nil
    });
  };
}

export default List;
