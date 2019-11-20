import { Rule, applyRule } from "../../rule";
import { chainRules, field, shape, when, scope } from "..";
import ifThenElse from "../ifthenelse";

describe("higher order rules:", () => {
  it("chainRules uses chains output to input: ", () => {
    // Arrange
    const rule1 = Rule(x => x * 2);
    const rule2 = Rule(x => x + 1);

    const rule = [rule1, rule2] |> chainRules
    const model = 1;

    // Act
    const result = applyRule(rule, model, null);

    // Assert
    expect(result).toBe(3);
  });

  it("field applies rule on field: ", () => {
    // Arrange
    const rule = field("name", Rule.of("ok"));
    const model = {
      name: null
    };

    // Act
    const result = applyRule(rule, model, null);

    // Assert
    expect(result.name).toBe("ok");
  });

  it("field reference economy when unchanged: ", () => {
    // Arrange
    const rule = field("name", Rule.of("ok"));
    const model = {
      name: "ok"
    };

    // Act
    const result = applyRule(rule, model, null);

    // Assert
    expect(result).toBe(model);
  });

  it("shape applies rule on fields: ", () => {
    // Arrange
    const rule = shape({
      name: Rule.of("name"),
      surname: Rule.of("surname"),
    });

    const model = {
      name: null,
      surname: null,
    };

    // Act
    const result = applyRule(rule, model, null);

    // Assert
    expect(result).toStrictEqual({ name: "name", surname: "surname" });
  });

  it("scope changes the current document: ", () => {
    // Arrange
    const rule = scope(_ => ({ scopeField: "OK" }), Rule((model, ctx) => ctx.document.scopeField));
    const model = {};

    // Act
    const result = applyRule(rule, model, null);

    // Assert
    expect(result).toBe("OK");
  });

  it("when applies rule when condition is true: ", () => {
    // Arrange
    const rule = when(true, Rule.of("modified"))

    const model = null;

    // Act
    const result = applyRule(rule, model, null);

    // Assert
    expect(result).toBe("modified");
  });

  it("when applies rule when predicate returns true: ", () => {
    // Arrange
    const rule = when(() => true, Rule.of("modified"))

    const model = null;

    // Act
    const result = applyRule(rule, model, null);

    // Assert
    expect(result).toBe("modified");
  });

  it("when does not appy rule when  predicate returns false: ", () => {
    // Arrange
    const rule = when(() => false, Rule.of("name"))

    const model = "original";

    // Act
    const result = applyRule(rule, model, null);

    // Assert
    expect(result).toBe("original");
  });

  it("ifThenElse applies rule when predicate returns true: ", () => {
    // Arrange
    const rule = ifThenElse(() => true, Rule.of("true"), Rule.of("false"))

    const model = null;

    // Act
    const result = applyRule(rule, model, null);

    // Assert
    expect(result).toBe("true");
  });

  it("ifThenElse applies rule when predicate returns false: ", () => {
    // Arrange
    const rule = ifThenElse(() => false, Rule.of("true"), Rule.of("false"))

    const model = null;

    // Act
    const result = applyRule(rule, model, null);

    // Assert
    expect(result).toBe("false");
  });

  it("ifThenElse applies rule when condition is true: ", () => {
    // Arrange
    const rule = ifThenElse(true, Rule.of("true"), Rule.of("false"))

    const model = "original";

    // Act
    const result = applyRule(rule, model, null);

    // Assert
    expect(result).toBe("true");
  });

  it("ifThenElse applies rule when condition is false: ", () => {
    // Arrange
    const rule = ifThenElse(false, Rule.of("true"), Rule.of("false"))

    const model = "original";

    // Act
    const result = applyRule(rule, model, null);

    // Assert
    expect(result).toBe("false");
  });


  it("ifThenElse rule shotcircuit: ", () => {
    // Arrange
    const trueFn = jest.fn(() => "true");
    const falseFn = jest.fn(() => "false");
    const rule = ifThenElse(false, Rule(trueFn), Rule(falseFn))

    const model = "original";

    // Act
    const result = applyRule(rule, model, null);

    // Assert
    expect(result).toBe("false");
    expect(trueFn.mock.calls.length).toBe(0);
    expect(falseFn.mock.calls.length).toBe(1);
  });
});
