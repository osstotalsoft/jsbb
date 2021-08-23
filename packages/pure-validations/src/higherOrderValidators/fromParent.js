// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { Validator } from "../validator";
import { $do } from "@totalsoft/zion";
import { checkValidators } from "./_utils";

export default function fromParent(validatorFactory) {
  return $do(function*() {
    const [, { parentModel }] = yield Validator.ask();

    const v = validatorFactory(parentModel);
    checkValidators(v);
    return yield v;
  });
}
