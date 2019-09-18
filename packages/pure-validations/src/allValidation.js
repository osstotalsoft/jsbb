import { Validation } from "./validation";
import fl from "fantasy-land";

const allPrototype = {
  constructor: AllValidation,
  [fl.concat]: function(other) {
    return Validation.isValid(this.value) ? other : Validation.isValid(other.value) ? this : AllValidation(this.value[fl.concat](other.value));
  }
};

function AllValidation(validation) {
  return Object.assign(Object.create(allPrototype), { value: validation });
}

AllValidation[fl.empty] = function() {
  return AllValidation(Validation.Success());
};

export { AllValidation };
