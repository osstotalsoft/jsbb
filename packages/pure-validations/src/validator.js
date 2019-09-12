import { Reader } from "./reader";
import curry from "lodash.curry";

const Validator = Reader;
const emptyContext = {
  fieldPath: [],
  fieldFilter: _ => true,
  debug: false,
  debugFn: () => {}
}

const validate = curry(function validate(validator, model, ctx = emptyContext) {
  return validator.runReader(model, ctx);
})

export { Validator, validate };