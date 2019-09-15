import { Validation } from "./validation";

const allPrototype = {
  "fantasy-land/concat": function(other) {
    return Validation.match(this.value, {
      Success: () => other,
      Failure: _ =>
        Validation.match(other.value, {
          Success: () => this,
          Failure: _ => AllValidation(this.value["fantasy-land/concat"](other.value))
        })
    });
  }
};

function AllValidation(validation) {
  return Object.assign(Object.create(allPrototype), { value: validation });
}

AllValidation["fantasy-land/empty"] = function() {
  return Validation.Success();
};

export { AllValidation };
