import { Reader } from "./reader";
import curry from "lodash.curry";
import fl from "fantasy-land";

const Validator = Reader;
Validator.of = Validator[fl.of];

const emptyContext = {
  fieldPath: [],
  fieldFilter: _ => true,
  log: false,
  logger: { log: () => {} },
  abortEarly: false
};

const validate = curry(function validate(validator, model, ctx = emptyContext) {
  return validator.runReader(model, ctx);
});

export { Validator, validate };
