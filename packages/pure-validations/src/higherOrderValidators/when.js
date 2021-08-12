// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import Maybe from "@totalsoft/zion/data/maybe";
import { $do } from "@totalsoft/zion";
import { curry } from "ramda";
import { checkValidators } from "./_utils";
import Reader from "@totalsoft/zion/data/reader";

const { Nothing } = Maybe;

const when = curry(function when(predicate, validator) {
  const predicateReader = ensureReader(predicate);
  checkValidators(validator);

  return $do(function*() {
    const isTrue = yield predicateReader;
    return isTrue ? yield validator : Nothing;
  });
});

function ensureReader(predicate) {
  if (typeof predicate === "boolean") {
    return Reader.of(predicate);
  }
  if (typeof predicate === "function") {
    return Reader(predicate);
  }

  checkValidators(predicate);

  return predicate;
}

export default when;
