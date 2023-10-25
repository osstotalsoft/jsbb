// Copyright (c) TotalSoft.
// This source code is licensed under the MIT license.

import { renderHook, act } from "@testing-library/react-hooks";
import { render, fireEvent } from "@testing-library/react"
import { set, get, sequence } from "@totalsoft/react-state-lens";
import { useChangeTrackingLens } from "..";
import { map } from 'ramda'
import React from "react"
import '@testing-library/jest-dom'
jest.unmock("@totalsoft/change-tracking")

describe("useChangeTrackingLens hook", () => {

    it("returns model with updated property", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        const callback = () => {
            const [rootProf] = useChangeTrackingLens(initialModel)

            return { rootProf, fieldProf: rootProf.a.b };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            set(result.current.fieldProf)("OK");
        });

        // Assert
        const root = get(result.current.rootProf);
        const field = get(result.current.fieldProf);
        expect(field).toBe("OK");
        expect(root.a.b).toBe("OK");
        expect(root).not.toBe(initialModel);
    });

    it("updates property to null", () => {
        // Arrange
        const initialModel = { a: { b: "OK" } };
        const callback = () => {
            const [rootProf] = useChangeTrackingLens(initialModel)

            return { rootProf, fieldProf: rootProf.a.b };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            set(result.current.fieldProf)(null);
        });

        // Assert
        const root = get(result.current.rootProf);
        const field = get(result.current.fieldProf);
        expect(field).toBe(null);
        expect(root.a.b).toBe(null);
        expect(root).not.toBe(initialModel);
    });

    it("updates object property to null", () => {
        // Arrange
        const initialModel = { a: { b: {c : "OK"} } };
        const callback = () => {
            const [prof] = useChangeTrackingLens(initialModel)
            return { prof };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            get(result.current.prof.a.b.c);
            set(result.current.prof.a.b)(null);
        });

        // Assert
        const root = get(result.current.prof);
        expect(root.a.b).toBe(null);
        expect(root).not.toBe(initialModel);
    });

    it("returns model with rule applied to it inside loop", () => {
        // Arrange
        const initialModel = { a: [1, 2, 3] };
        const callback = () => {
            const [rootProf] = useChangeTrackingLens(initialModel)

            let array = get(rootProf.a)
            let fieldProfs = array.map((item, idx) => rootProf.a[idx]);

            return { rootProf, fieldProfs };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            set(result.current.fieldProfs[0])("OK");
        });

        // Assert
        const root = get(result.current.rootProf);
        const field = get(result.current.fieldProfs[0]);
        expect(field).toBe("OK");
        expect(root.a[0]).toBe("OK");
        expect(root).not.toBe(initialModel);
    });

    it("sets dirty info", () => {
        // Arrange
        const initialModel = { a: { b: "", c: "Initial", d: "" } };
        const callback = () => {
            const [rootProf, di] = useChangeTrackingLens(initialModel)

            return { rootProf, di };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            set(result.current.rootProf.a.b)("OK");
        });

        // Act
        act(() => {
            set(result.current.rootProf.a.d)("OK");
        });

        act(() => {
            set(result.current.rootProf.a.b)("OK1");
        });

        // Assert
        const dirtyInfo = result.current.di;
        expect(JSON.stringify(dirtyInfo)).toStrictEqual(JSON.stringify({ a: { b: true, d: true } }, initialModel))
    });


    it("enforces reference and render economy if updated with same value", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        let renderCount = 0;

        const callback = () => {
            const [rootProf] = useChangeTrackingLens(initialModel)
            renderCount = renderCount + 1;
            return { rootProf, fieldProf: rootProf.a.b };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            set(result.current.fieldProf)("OK");
        });
        const model1 = result.current.rootProf;
        act(() => {
            set(result.current.fieldProf)("OK");
        });
        const model2 = result.current.rootProf;

        // Assert
        expect(model1).toBe(model2);
        expect(renderCount).toBe(3)
    });

    it("renders only changed component", () => {
        // Arrange
        const initialModel = { first: { value: "first" }, second: { value: "second" } };
        const renderCalls = { [0]: 0, [1]: 0 }

        // eslint-disable-next-line no-unused-vars
        const NestedComponent = React.memo(({ id, state: lens }) => {
            renderCalls[id] = renderCalls[id] + 1
            return (<div>
                <span role="nested-value">{get(lens.value)}</span>
                <button role="nested-button" onClick={() => set(lens.value)("changed")}></button>
            </div>)
        })

        // eslint-disable-next-line no-unused-vars
        function ParentComponent({ initialModel }) {
            const [rootLens] = useChangeTrackingLens(initialModel)
            return (<>
                <NestedComponent id={0} state={rootLens.first} />
                <NestedComponent id={1} state={rootLens.second} />
            </>)
        }

        // Act
        const { getAllByRole } = render(<ParentComponent initialModel={initialModel}></ParentComponent>)

        expect(screen).toBeDefined();

        const values = getAllByRole("nested-value")
        expect(values.length).toBe(2)
        expect(values[0]).toHaveTextContent("first")
        expect(values[1]).toHaveTextContent("second")


        const buttons = getAllByRole("nested-button")
        fireEvent.click(buttons[0])

        // Assert
        expect(renderCalls).toEqual({ [0]: 2, [1]: 1 })
        expect(values[0]).toHaveTextContent("changed")
        expect(values[1]).toHaveTextContent("second")
    })

    it("renders only changed component - sequence", () => {
        // Arrange
        const initialModel = { root: { items:[{ id: 0, value: "first" }, { id:1, value: "second" } ]}};
        const renderCalls = { [0]: 0, [1]: 0 }

        // eslint-disable-next-line no-unused-vars
        const NestedComponent = React.memo(({ id, state: lens }) => {
            renderCalls[id] = renderCalls[id] + 1
            return (<div>
                <span role="nested-value">{get(lens.value)}</span>
                <button role="nested-button" onClick={() => set(lens.value)("changed")}></button>
            </div>)
        })

        // eslint-disable-next-line no-unused-vars
        function ParentComponent({ initialModel }) {
            const [rootLens] = useChangeTrackingLens(initialModel)
            return (<>
                 {rootLens.root.items
                    |> sequence
                    |> map(v => <NestedComponent key={v.id |> get} state={v} id={v.id |> get} />)}

            </>)
        }

        // Act
        const { getAllByRole } = render(<ParentComponent initialModel={initialModel}></ParentComponent>)

        expect(screen).toBeDefined();

        const values = getAllByRole("nested-value")
        expect(values.length).toBe(2)
        expect(values[0]).toHaveTextContent("first")
        expect(values[1]).toHaveTextContent("second")


        const buttons = getAllByRole("nested-button")
        fireEvent.click(buttons[0])

        // // Assert
        expect(renderCalls).toEqual({ [0]: 2, [1]: 1 })
        expect(values[0]).toHaveTextContent("changed")
        expect(values[1]).toHaveTextContent("second")
    })

    it("returns initial model when not changed", () => {
        // Arrange
        const initialModel = { a: { b: "" } };

        // Act
        const { result } = renderHook(() => useChangeTrackingLens(initialModel));

        // Assert
        const [model] = result.current;
        expect(get(model)).toBe(initialModel);

    });


    it("returns initial model after reset", () => {
        // Arrange
        const initialModel = { a: { b: "" } };

        const callback = () => {
            const [rootProf, , resetFunc] = useChangeTrackingLens(initialModel)

            return { rootProf, fieldProf: rootProf.a.b, resetFunc };
        }

        // Act
        const { result } = renderHook(callback);
        act(() => {
            const { fieldProf } = result.current;
            set(fieldProf, "OK")
        });
        const { rootProf: rootProf1 } = result.current;
        act(() => {
            const { resetFunc } = result.current;
            resetFunc(initialModel);
        });

        // Assert
        const { rootProf: rootProf2 } = result.current;
        expect(get(rootProf1)).not.toBe(initialModel);
        expect(get(rootProf2)).toBe(initialModel);
    });

    it("should minimize the number of renders", () => {
        // Arrange
        const initialModel = { a: { b: "" } };
        let renderNo = 0;
        function renderCallack() {
            renderNo = renderNo + 1;
            const [rootProf] = useChangeTrackingLens(initialModel)
            return { rootProf, fieldProf: rootProf.a.b, };
        }

        // Act
        const { result, rerender } = renderHook(renderCallack);
        act(() => {
            const { fieldProf } = result.current;
            set(fieldProf, "OK")
        });
        rerender();

        // Assert
        expect(renderNo).toBe(3);
    });


    it("does not change the returned object references on re-render", () => {
        // Arrange
        const initialModel = { a: { b: "" } };

        // Act
        const { result, rerender } = renderHook(() => useChangeTrackingLens(initialModel));
        const [prof1, dirtyInfo1, reset1] = result.current;
        rerender();
        const [prof2, dirtyInfo2, reset2] = result.current;

        // Assert
        expect(prof1).toBe(prof2);
        expect(dirtyInfo1).toBe(dirtyInfo2);
        expect(reset1).toBe(reset2);
    });

    it("it doesn't change when when the initial model changes", () => {
        // Arrange
        const callback = () => useChangeTrackingLens({});

        // Act
        const { result, rerender } = renderHook(callback);
        const [prof1, dirtyInfo1, reset1] = result.current;
        rerender();
        const [prof2, dirtyInfo2, reset2] = result.current;

        // Assert
        expect(prof1).toBe(prof2);
        expect(dirtyInfo1).toBe(dirtyInfo2);
        expect(reset1).toBe(reset2);
    });
});
