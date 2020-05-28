import Reader from "@totalsoft/zion/data/reader";
import { checkValidators } from "./higherOrderValidators/_utils";
import { curry } from "ramda";
import * as fl from "fantasy-land";

const Validator = Reader;
Validator.of = Validator[fl.of];

const emptyContext = {
  fieldPath: [],
  fieldFilter: _ => true,
  log: false,
  logger: { log: () => {} },
  parentModel: null,
  parentContext:null
};

const validate = curry(function validate(validator, model, ctx = undefined) {
  checkValidators(validator);
  return validator.runReader(model, { ...emptyContext, ...ctx });
});

export { Validator, validate };
