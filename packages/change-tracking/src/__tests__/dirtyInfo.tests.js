import { create, isDirty, update, merge, isPropertyDirty, detectChanges} from "../dirtyInfo";
import { ensureArrayUIDs } from "../arrayUtils";

describe("dirty info operations:", () => {
    it("creates dirtyInfo: ", () => {
        // Arrange
        // Act
        const di = create();
        // Assert
        expect(isDirty(di)).toBe(false);
    });


    it("creates dirtyInfo initialized to true:", () => {
        // Arrange
        // Act
        const di = create(true);
        // Assert
        expect(isDirty(di)).toBe(true);
    });

    it("updates dirtyInfo property path", () => {
        // Arrange
        const di = create();
        // Act
        const updated = update("a.b", true, di);
        // Assert
        expect(isDirty(updated)).toBe(true);
        expect(isDirty(updated.a.b)).toBe(true);
    });

    it("merges dirtyInfo values", () => {
        // Arrange
        const di1 = update("a.b", true, create());
        const di2 = update("a.c", true, create());

        // Act
        const merged = merge(di1, di2);

        // Assert
        expect(isDirty(merged)).toBe(true);
        expect(isDirty(merged.a.b)).toBe(true);
        expect(isDirty(merged.a.c)).toBe(true);
    });

    it("checks dirty value for string path", () => {
        // Arrange
        const di = update("a.b", true, create());

        // Act
        const isDirty = isPropertyDirty("a.b", di);

        // Assert
        expect(isDirty).toBe(true);
    });

    it("checks dirty value for array path", () => {
        // Arrange
        const di = update("a.b", true, create());

        // Act
        const isDirty = isPropertyDirty(["a", "b"], di);

        // Assert
        expect(isDirty).toBe(true);
    });

    it("checks dirty value for non existing path", () => {
        // Arrange
        const di = update("a.b", true, create());

        // Act
        const isDirty = isPropertyDirty("a.c", di);

        // Assert
        expect(isDirty).toBe(false);
    });

    it("detects changes on object path", () => {
        // Arrange
        const prevModel = { a: {b: "initial"}}
        const crtModel = { a: {b: "modified"}}

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isPropertyDirty("a.b", di)).toBe(true);
    });

    it("checks that new property in object is not dirty", () => {
        // Arrange
        const prevModel = {a: 1}
        const crtModel = {a: 1, b: 2}

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(false);
        expect(isDirty(di.b)).toBe(false);
    });

    it("checks that removed property in object does not make it dirty", () => {
        // Arrange
        const prevModel = {a: 1, b: 2}
        const crtModel = {b: 2}

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(false);
        expect(isDirty(di.b)).toBe(false);
    });

    it("detects changes on array", () => {
        // Arrange
        const prevModel = [1, 2]
        const crtModel = [1, 99]

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di[0])).toBe(false);
        expect(isDirty(di[1])).toBe(true);
    });

    it("checks that reordered object array with UIDs are not dirty", () => {
        // Arrange
        const prevModel = ensureArrayUIDs([{a: 1}, {a: 2}])
        const crtModel = [prevModel[1], prevModel[0]]

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di[0])).toBe(false);
        expect(isDirty(di[1])).toBe(false);
    });

    it("checks that new object item in array with UIDs is not dirty", () => {
        // Arrange
        const prevModel = ensureArrayUIDs([{a: 1}])
        const crtModel = ensureArrayUIDs([{a : 2 }, ...prevModel])

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di[0])).toBe(false);
        expect(isDirty(di[1])).toBe(false);
    });

    it("checks that deleted object item in array with UIDs does not make others dirty", () => {
        // Arrange
        const prevModel = ensureArrayUIDs([{a: 1}, {a: 2}, {a: 3}])
        const crtModel = [prevModel[0], prevModel[2]]

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di[0])).toBe(false);
        expect(isDirty(di[1])).toBe(false);
    });

    it("checks that changes on object item in array with UIDs are detected", () => {
        // Arrange
        const prevModel = ensureArrayUIDs([{a: 1}])
        const crtModel = [{...prevModel[0], a: 2}]

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di[0])).toBe(true);
        expect(isDirty(di[0].a)).toBe(true);
    });

});
