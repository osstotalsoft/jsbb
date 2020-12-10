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

    it("detects changes on dates", () => {
        // Arrange
        const prevModel = new Date(2000,1,2)
        const crtModel = new Date(2000,1,1)

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(true);
    });

    it("detects not changed on dates", () => {
        // Arrange
        const prevModel = new Date(2000,1,2)
        const crtModel = new Date(2000,1,2)

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(false);
    });

    it("detects changes on boxed number", () => {
        // Arrange
        const prevModel = new Number(1)
        const crtModel = new Number(2)

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(true);
    });

    it("detects not changed on boxed number", () => {
        // Arrange
        const prevModel = new Number(1)
        const crtModel = new Number(1)

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(false);
    });

    it("detects changes on regex", () => {
        // Arrange
        const prevModel = /.*/
        const crtModel = /.+/

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(true);
    });

    it("detects not changed on regex", () => {
        // Arrange
        const prevModel = /.*/
        const crtModel = /.*/

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(false);
    });

    it("detects changes on functions", () => {
        // Arrange
        const prevModel = x => x
        const crtModel = x => x + 1

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(true);
    });

    it("detects not changed on functions", () => {
        // Arrange
        const prevModel = x => x + 1
        const crtModel = x => x + 1

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(true);
    });

    it("detects changes on objects with custom constructors", () => {
        // Arrange
        function Tree(name) {
            this.name = name
        }
        const prevModel = new Tree("Oak")
        const crtModel = new Tree("Pine")

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(true);
    });    


    it("detects not changed on object with custom constructor", () => {
        // Arrange
        function Tree(name) {
            this.name = name
        }
        const prevModel = new Tree("Oak")
        const crtModel = new Tree("Oak")

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(false);
    });

    it("detects changes on object", () => {
        // Arrange
        const prevModel = {}
        const crtModel = { a: 1}

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(true);
    });

    it("detects not changed on empty object", () => {
        // Arrange
        const prevModel = {}
        const crtModel = {}

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(false);
    });

    it("detects not changed on NaN", () => {
        // Arrange
        const prevModel = NaN
        const crtModel = NaN

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(false);
    });

    it("detects not changed on null", () => {
        // Arrange
        const prevModel = null
        const crtModel = null

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(false);
    });

    it("detects not changed on undefined", () => {
        // Arrange
        const prevModel = undefined
        const crtModel = undefined

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(false);
    });

    it("detects not changed on empty string", () => {
        // Arrange
        const prevModel = ""
        const crtModel = ""

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(false);
    });

    it("checks that new property in object is dirty", () => {
        // Arrange
        const prevModel = {a: 1}
        const crtModel = {a: 1, b: 2}

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di.b)).toBe(true);
    });

    
    it("checks that new undefined property in object is not dirty", () => {
        // Arrange
        const prevModel = {a: 1}
        const crtModel = {a: 1, b: undefined}

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di.b)).toBe(false);
    });

    it("checks that object with new property is dirty", () => {
        // Arrange
        const prevModel = {a: 1}
        const crtModel = {a: 1, b: 2}

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(true);
    });

    it("checks that removed property in object is not marked as dirty", () => {
        // Arrange
        const prevModel = {a: 1, b: 2}
        const crtModel = {b: 2}

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di.a)).toBe(false);
    });

    it("checks that a object with a removed property is dirty", () => {
        // Arrange
        const prevModel = {a: 1, b: 2}
        const crtModel = {b: 2}

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(true);
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
        expect(isDirty(di)).toBe(true);
    });

    it("detects changes on array with added items", () => {
        // Arrange
        const prevModel = [1, 2]
        const crtModel = [1, 2, 3]

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di[0])).toBe(false);
        expect(isDirty(di[1])).toBe(false);
        expect(isDirty(di[2])).toBe(false);
        expect(isDirty(di)).toBe(true);
    });

    it("detects changes on array with removed items", () => {
        // Arrange
        const prevModel = [1, 2, 3]
        const crtModel = [1, 2]

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di[0])).toBe(false);
        expect(isDirty(di[1])).toBe(false);
        expect(isDirty(di[2])).toBe(false);
        expect(isDirty(di)).toBe(true);
    });

    it("checks that reordered object items in array with UIDs are not dirty", () => {
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

    it("checks that UID array with added object item is dirty", () => {
        // Arrange
        const prevModel = ensureArrayUIDs([{a: 1}])
        const crtModel = ensureArrayUIDs([{a : 2 }, ...prevModel])

        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(true);        
    });

    it("checks that UID array with deleted object item is dirty", () => {
        // Arrange
        const prevModel = ensureArrayUIDs([{a: 1}, {a: 2}, {a: 3}])
        const crtModel = [prevModel[0], prevModel[2]]
        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(true);        
    });  
    
    it("checks that UID array with reordered object items is dirty", () => {
        // Arrange
        const prevModel = ensureArrayUIDs([{a: 1}, {a: 2}, {a: 3}])
        const crtModel = [prevModel[0], prevModel[2], prevModel[1]]
        // Act
        const di = detectChanges(crtModel, prevModel);

        // Assert
        expect(isDirty(di)).toBe(true);        
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
