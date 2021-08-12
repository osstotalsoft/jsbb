// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { ensureReader } from "../predicates";

export default function readFrom(func) {
  return ensureReader(func);
}
