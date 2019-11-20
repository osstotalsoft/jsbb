import { not, equals, all, Predicate, propertiesChanged, propertyChanged } from "..";
import Reader from "@totalsoft/zion/data/reader";

describe("predicates:", () => {
  it("not with reader predicate", () => {
    // Arrange
    const model = 6;
    const predicate = not(Reader(_ => true));

    // Act
    const newModel = predicate.runReader(model, null);

    // Assert
    expect(newModel).toBe(false);
  });

  it("not with predicate", () => {
    // Arrange
    const model = 6;
    const predicate = not(_ => true);

    // Act
    const newModel = predicate.runReader(model, null);

    // Assert
    expect(newModel).toBe(false);
  });

  it("not with constant value", () => {
    // Arrange
    const model = 6;
    const predicate = not(true);

    // Act
    const newModel = predicate.runReader(model, null);

    // Assert
    expect(newModel).toBe(false);
  });

  it("equals", () => {
    // Arrange
    const model = 6;
    const predicate = equals(_ => 1, _ => 1);

    // Act
    const newModel = predicate.runReader(model, {});

    // Assert
    expect(newModel).toBe(true);
  });

  it("all with reader predicates should return true", () => {
    // Arrange
    const model = 6;
    const predicate = all([Predicate(_ => true), Predicate(_ => true)]);

    // Act
    const newModel = predicate.runReader(model, {});

    // Assert
    expect(newModel).toBe(true);
  });

  it("all with predicates should return true", () => {
    // Arrange
    const model = 6;
    const predicate = all([_ => true, _ => true]);

    // Act
    const newModel = predicate.runReader(model, {});

    // Assert
    expect(newModel).toBe(true);
  });

  it("all with predicates should return false", () => {
    // Arrange
    const model = 6;
    const predicate = all([_ => true, _ => false]);

    // Act
    const newModel = predicate.runReader(model, {});

    // Assert
    expect(newModel).toBe(false);
  });

  it("propertyChanged should return true", () => {
    // Arrange
    const model = 6;
    const predicate = propertyChanged(doc => doc.property);

    // Act
    const newModel = predicate.runReader(model, { document: { property: 1 }, prevDocument: { property: 2 } });

    // Assert
    expect(newModel).toBe(true);
  });

  it("propertyChanged should return false", () => {
    // Arrange
    const model = 6;
    const predicate = propertyChanged(doc => doc.property);

    // Act
    const newModel = predicate.runReader(model, { document: { property: 1 }, prevDocument: { property: 1 } });

    // Assert
    expect(newModel).toBe(false);
  });

  it("propertiesChanged should return true", () => {
    // Arrange
    const model = 6;
    const predicate = propertiesChanged(doc => [doc.property1, doc.property2]);

    // Act
    const newModel = predicate.runReader(model, { document: { property1: 1, property2: 1 }, prevDocument: { property: 2, property2: 1 } });

    // Assert
    expect(newModel).toBe(true);
  });

  it("propertiesChanged should return false", () => {
    // Arrange
    const model = 6;
    const predicate = propertiesChanged(doc => [doc.property1, doc.property2]);

    // Act
    const newModel = predicate.runReader(model, { document: { property1: 1, property2: 1 }, prevDocument: { property: 1, property2: 1 } });

    // Assert
    expect(newModel).toBe(true);
  });
});
