import { Validation } from "../validation";
import { validate } from "../validator";
import { required, maxLength, greaterThan, unique } from "../primitiveValidators";
import { shape, items, all, when, fromModel, logTo, abortEarly } from "../higherOrderValidators";

describe("combo validators:", () => {
  it("readme validator success: ", () => {
    const gdprAgreement = () => true;
    // Arrange
    const validator =
      shape({
        contactInfo: shape({
          name: [required, maxLength(50)] |> all |> abortEarly,
          email: required |> when(gdprAgreement)
        }),
        personalInfo: fromModel(x =>
          shape({
            age: greaterThan(x.minimumAllowedAge)
          })
        ),
        assets: [unique("id"), required |> items] |> all
      }) |> logTo({ log: () => {} });

    const model = {
      maxLength: 4,
      name: "test"
    };

    // Act
    const validation = model |> validate(validator);

    // Assert
    expect(validation).toBe(Validation.Success());
  });
});
