// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import Reader from "@totalsoft/zion/data/reader";
import { $do } from "@totalsoft/zion";
import { checkValidators } from "./_utils";

export default function fromRoot(validatorFactory) {
  return $do(function*() {
    let [model, ctx] = yield Reader.ask();

    while (ctx?.parentModel) {
      model = ctx.parentModel;
      ctx = ctx.parentCtx;
    }

    const v = validatorFactory(model);
    checkValidators(v);
    return yield v;
  });
}
