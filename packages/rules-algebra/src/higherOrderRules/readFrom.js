// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { ensurePredicate } from "../predicates";

export default function readFrom(func) {
  return ensurePredicate(func);
}
