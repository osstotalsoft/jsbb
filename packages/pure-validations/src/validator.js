import { Reader } from "./reader";

const Validator = Reader;

function validate(validator, model, ctx = null) {
  return validator.runReader(model, ctx);
}

export { Validator, validate };