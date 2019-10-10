import { eq } from "../index";
import Maybe from "../../data/maybe";
import List from "../../data/list";

const { Just, Nothing } = Maybe;
const { Nil } = List;

describe("eq tests:", () => {
  it("should work on Maybes: ", () => {
    // Arrange

    // Act && Assert
    expect(eq(Just(5), Just(5))).toBe(true);
    expect(eq(Nothing, Nothing)).toBe(true);
    expect(eq(Just(5), Nothing)).toBe(false);
    expect(eq(Just(Just(Just(5))), Just(Just(Just(5))))).toBe(true);
    expect(eq(Just("tra la la"), Just("tra la la"))).toBe(true);
  });

  it("should work on Lists: ", () => {
    // Arrange

    // Act && Assert
    expect(eq(List.fromArray([1, 2]), List.fromArray([1, 2]))).toBe(true);
    expect(eq(Nil, Nil)).toBe(true);
    expect(eq(List.fromArray([1, 2]), Nil)).toBe(false);
    expect(eq(List.fromArray([List.fromArray([1, 2]), List.fromArray([3])]), List.fromArray([List.fromArray([1, 2]), List.fromArray([3])]))).toBe(
      true
    );
    expect(eq(List.fromArray(["tra", "la", "la"]), List.fromArray(["tra", "la", "la"]))).toBe(true);
  });
});
