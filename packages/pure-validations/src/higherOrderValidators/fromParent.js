// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import Reader from "@totalsoft/zion/data/reader";
import { $do } from "@totalsoft/zion";
import { checkValidators } from "./_utils";

export default function fromParent(validatorFactory) {
  return $do(function*() {
    const [, { parentModel }] = yield Reader.ask();

    const v = validatorFactory(parentModel);
    checkValidators(v);
    return yield v;
  });
}
