import { applyRule } from "../../rule";
import { min, max, constant, minimumValue, maximumValue, computed, unchanged } from "..";

describe("primitive rules:", () => {
  it("computed rule using current model value", () => {
    // Arrange
    const model = 6;
    const rule = computed(doc => doc + 1);

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(7);
  });


  it("computed rule using previous model value ", () => {
    // Arrange
    const model = 6;
    const prevModel = 4;
    const rule = computed((model, prevModel) => model + prevModel);

    // Act
    const newModel = applyRule(rule, model, prevModel);

    // Assert
    expect(newModel).toBe(10);
  });

  it("computed rule using prop value ", () => {
    // Arrange
    const model = 6;
    const prevModel = 4;
    const rule = computed((_model, _prevModel, value) => value + 1);

    // Act
    const newModel = applyRule(rule, model, prevModel);

    // Assert
    expect(newModel).toBe(7);
  });

  it("constant rule", () => {
    // Arrange
    const model = 1;
    const rule = constant(7);

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(7);
  });

  it("unchanged rule", () => {
    // Arrange
    const model = 1;
    const rule = unchanged;

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(1);
  });


  it("min rule with constant values", () => {
    // Arrange
    const model = 6;
    const rule = min(4, 7);

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(4);
  });

  it("min rule with selectors values", () => {
    // Arrange
    const model = { min1: 4, min2: 7, val: 6 };
    const rule = min(doc => doc.min1, doc => doc.min2);

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(4);
  });

  it("min rule with readers values succeed", () => {
    // Arrange
    const model = 6;
    const rule = min(constant(4), constant(7));

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(4);
  });

  it("max rule with constant values succeed", () => {
    // Arrange
    const model = 6;
    const rule = max(4, 7);

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(7);
  });

  it("max rule with selectors values succeed", () => {
    // Arrange
    const model = { min1: 4, min2: 7, val: 6 };
    const rule = max(doc => doc.min1, doc => doc.min2);

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(7);
  });

  it("max rule with readers values", () => {
    // Arrange
    const model = 6;
    const rule = max(constant(4), constant(7));

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(7);
  });

  it("minimumValue rule with constant values - value should change", () => {
    // Arrange
    const model = 3;
    const rule = minimumValue(4);

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(4);
  });

  it("minimumValue rule with reader values - value should change", () => {
    // Arrange
    const model = 3;
    const rule = minimumValue(constant(4));

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(4);
  });

  it("minimumValue rule with constant values - value should not change", () => {
    // Arrange
    const model = 6;
    const rule = minimumValue(5);

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(6);
  });

  it("minimumValue rule with readers values - value should not change", () => {
    // Arrange
    const model = 6;
    const rule = minimumValue(constant(5));

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(6);
  });

  it("maximumValue rule with constant values - value should change", () => {
    // Arrange
    const model = 6;
    const rule = maximumValue(5);

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(5);
  });

  it("maximumValue rule with reader values - value should change", () => {
    // Arrange
    const model = 6;
    const rule = maximumValue(constant(5));

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(5);
  });

  it("maximumValue rule with constant values - value should not change", () => {
    // Arrange
    const model = 6;
    const rule = maximumValue(7);

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(6);
  });

  it("maximumValue rule with readers values - value should not change", () => {
    // Arrange
    const model = 6;
    const rule = maximumValue(constant(7));

    // Act
    const newModel = applyRule(rule, model, null);

    // Assert
    expect(newModel).toBe(6);
  });
});
