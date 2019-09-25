import { Validation } from "./validation";
import fl from "fantasy-land";

const anyPrototype = {
  constructor: AnyValidation,
  [fl.concat]: function(other) {
    return Validation.isValid(this.value) ? this : Validation.isValid(other.value) ? other : AnyValidation(this.value[fl.concat](other.value));
  }
};

function AnyValidation(validation) {
  return Object.assign(Object.create(anyPrototype), { value: validation });
}

AnyValidation[fl.empty] = function() {
  return AnyValidation(Validation.Failure());
};

AnyValidation.mergeStrategy = {
  from: x => x.value,
  to: x => AnyValidation(x)
}

export { AnyValidation };
