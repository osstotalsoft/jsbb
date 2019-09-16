import { Validation } from "./validation";
import fl from "fantasy-land";

const allPrototype = {
  constructor: AnyValidation,
  [fl.concat]: function(other) {
    return Validation.isValid(this.value) ? this : Validation.isValid(other.value) ? other : AnyValidation(this.value[fl.concat](other.value));
  }
};

function AnyValidation(validation) {
  return Object.assign(Object.create(allPrototype), { value: validation });
}

AnyValidation[fl.empty] = function() {
  return AnyValidation(Validation.Failure());
};

export { AnyValidation };
