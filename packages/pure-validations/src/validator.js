import { Reader } from "./reader";
import curry from "lodash.curry";

const Validator = Reader;

const validate = curry(function validate(validator, model, ctx = null) {
  return validator.runReader(model, ctx);
})

export { Validator, validate };