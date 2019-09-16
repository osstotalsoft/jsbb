import { Validation } from "./validation";

const allPrototype = {
  "fantasy-land/concat": function(other) {
    return Validation.match(this.value, {
      Success: () => this,
      Failure: _ =>
        Validation.match(other.value, {
          Success: () => other,
          Failure: _ => AnyValidation(this.value["fantasy-land/concat"](other.value))
        })
    });
  }
};

function AnyValidation(validation) {
  return Object.assign(Object.create(allPrototype), { value: validation });
}

AnyValidation["fantasy-land/empty"] = function() {
  return Validation.Failure();
};

export { AnyValidation };
