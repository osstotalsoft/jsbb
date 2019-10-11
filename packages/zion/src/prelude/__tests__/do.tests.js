import { $do } from "../index";
import Maybe from "../../data/maybe";
import List from "../../data/list";

const { Just, Nothing } = Maybe;

const monadSum = (monadX, monadY) =>
  $do(function*() {
    const x = yield monadX;
    const y = yield monadY;
    return x + y;
  });

describe("do notation:", () => {
  it("should chain Maybes: ", () => {
    // Arrange

    // Act && Assert
    expect(monadSum(Just(5), Just(6))).toStrictEqual(Just(11));
    expect(monadSum(Just(5), Nothing)).toStrictEqual(Nothing);
  });

  it("should chain Lists: ", () => {
    // Arrange

    // Act && Assert
    expect(monadSum(List.fromArray([1, 2]), List.fromArray([3]))).toStrictEqual(List.fromArray([1 + 3, 2 + 3]));
    expect(monadSum(List.fromArray([1]), List.fromArray([2]))).toStrictEqual(List.fromArray([1 + 2]));
    expect(monadSum(List.fromArray([1, 2]), List.fromArray([3, 4]))).toStrictEqual(List.fromArray([1 + 3, 1 + 4, 2 + 3, 2 + 4]));
  });

  it("should chain arrays: ", () => {
    // Arrange

    // Act && Assert
    expect(monadSum([1, 2], [3])).toStrictEqual([1 + 3, 2 + 3]);
    expect(monadSum([1], [2])).toStrictEqual([1 + 2]);
    expect(monadSum([1, 2], [3, 4])).toStrictEqual([1 + 3, 1 + 4, 2 + 3, 2 + 4]);
  });
});
