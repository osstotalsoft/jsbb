import { renderHook, act } from "@testing-library/react-hooks";
import { useDirtyInfo } from "../";


describe("useDirtyInfo hook", () => {
    it("should set dirtyInfo property", () => {
        // Arrange

        // Act
        const { result } = renderHook(() => useDirtyInfo());
        act(() => {
            const [, setProperty] = result.current;
            setProperty("a.b", "OK");
        });

        // Assert
        const [dirtyInfo] = result.current;
        expect(dirtyInfo.a.b).toBe(true);
    });

    it("should enforce reference economy for dirty info", () => {
        // Arrange

        // Act
        const { result } = renderHook(() => useDirtyInfo());
        act(() => {
            const [, setProperty] = result.current;
            setProperty("a.b", "OK");
        });
        const [dirtyInfo1] = result.current;

        act(() => {
            const [, setProperty] = result.current;
            setProperty("a.b", "OK");
        });

        // Assert
        const [dirtyInfo2] = result.current;
        expect(dirtyInfo1).toBe(dirtyInfo2);
    });

    it("should reset dirtyInfo property", () => {
        // Arrange

        // Act
        const { result } = renderHook(() => useDirtyInfo());
        act(() => {
            const [, setProperty] = result.current;
            setProperty("a.b", "OK");
        });
        act(() => {
            const [, , resetDirtyInfo] = result.current;
            resetDirtyInfo();
        });


        // Assert
        const [dirtyInfo] = result.current;
        expect(dirtyInfo.a ?.b).toBe(undefined);
    });
});


