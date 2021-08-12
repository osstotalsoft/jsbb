// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import Reader from "@totalsoft/zion/data/reader";
import { $do } from "@totalsoft/zion";
import { checkRules } from "../_utils";

export default function fromParent(ruleFactory) {
  return $do(function* () {
    const [model, { parentModel }] = yield Reader.ask();
    if (parentModel === null || parentModel === undefined) {
      return model;
    }
    const v = ruleFactory(parentModel);
    checkRules(v);
    return yield v;
  });
}
