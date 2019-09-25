import { Validation } from "./validation";
import fl from "fantasy-land";
import { concat } from "./fantasy/prelude";

const allPrototype = {
  constructor: AllValidation,
  [fl.concat]: function(other) {
    return AllValidation(concat(this.value, other.value));
  }
};

function AllValidation(validation) {
  return Object.assign(Object.create(allPrototype), { value: validation });
}

AllValidation[fl.empty] = function() {
  return AllValidation(Validation.Success());
};

export { AllValidation };
