import Reader from "@totalsoft/zion/data/reader";
import curry from "lodash.curry";
import fl from "fantasy-land";

const Validator = Reader;
Validator.of = Validator[fl.of];

const emptyContext = {
  fieldPath: [],
  fieldFilter: _ => true,
  log: false,
  logger: { log: () => {} }
};

const validate = curry(function validate(validator, model, ctx = undefined) {
  return validator.runReader(model, { ...emptyContext, ...ctx });
});

export { Validator, validate };
