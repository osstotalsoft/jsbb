import { lift2 } from "../index";
import Maybe from "../../data/maybe";
import List from "../../data/list";

const { Just, Nothing } = Maybe;

describe("lift2:", () => {
  it("should lift binary function on Maybe: ", () => {
    // Arrange
    const sum = a => b => a + b;
    const monadSum = lift2(sum);

    // Act && Assert
    expect(monadSum(Just(5), Just(6))).toStrictEqual(Just(11));
    expect(monadSum(Just(5), Nothing)).toStrictEqual(Nothing);
  });

  it("should lift binary function on List: ", () => {
    // Arrange
    const sum = a => b => a + b;
    const monadSum = lift2(sum);

    // Act && Assert
    expect(monadSum(List.fromArray([1, 2]), List.fromArray([3]))).toStrictEqual(List.fromArray([1 + 3, 2 + 3]));
    expect(monadSum(List.fromArray([1]), List.fromArray([2]))).toStrictEqual(List.fromArray([1 + 2]));
    expect(monadSum(List.fromArray([1, 2]), List.fromArray([3, 4]))).toStrictEqual(List.fromArray([1 + 3, 1 + 4, 2 + 3, 2 + 4]));
  });
});
