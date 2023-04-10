import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { createStore } from "../createStore";

describe("createStore", () => {
  it("returns a hook function", () => {
    const useStore = createStore({});
    expect(typeof useStore).toBe("function");
  });

  it("returns the initial store state", () => {
    const useStore = createStore({ name: "Grogu" });
    const TestComponent = () => {
      const [state] = useStore(["name"]);
      return <div data-testid="test">{state.name}</div>;
    };
    render(<TestComponent />);
    expect(screen.getByTestId("test").innerHTML).toBe("Grogu");
  });

  it("updates the store state when a value is set", () => {
    const useStore = createStore({ name: "Grogu" });
    const TestComponent = () => {
      const [state, setState] = useStore(["name"]);
      return (
        <>
          <div data-testid="test">{state.name}</div>
          <button
            data-testid="button"
            onClick={() => setState({ name: "Baby Yoda" })}
          >
            Update
          </button>
        </>
      );
    };
    render(<TestComponent />);
    expect(screen.getByTestId("test").innerHTML).toBe("Grogu");
    act(() => {
      screen.getByTestId("button").click();
    });
    expect(screen.getByTestId("test").innerHTML).toBe("Baby Yoda");
  });

  it("updates the state of multiple keys when a value is set", () => {
    const useStore = createStore({ name: "Grogu", age: 50 });
    const TestComponent = () => {
      const [state, setState] = useStore(["name", "age"]);
      return (
        <>
          <div data-testid="name">{state.name}</div>
          <div data-testid="age">{state.age}</div>
          <button
            data-testid="button"
            onClick={() => setState({ name: "age", age: 75 })}
          >
            Update
          </button>
        </>
      );
    };
    render(<TestComponent />);
    expect(screen.getByTestId("name").innerHTML).toBe("Grogu");
    expect(screen.getByTestId("age").innerHTML).toBe("50");
    act(() => {
      screen.getByTestId("button").click();
    });
    expect(screen.getByTestId("name").innerHTML).toBe("age");
    expect(screen.getByTestId("age").innerHTML).toBe("75");
  });

  it("can only update those values which are part of dependecy", () => {
    const useStore = createStore({ name: "Grogu", age: 50 });
    const TestComponent = () => {
      const [{ name }, setState] = useStore(["name"]);
      return (
        <>
          <div data-testid="name">{name}</div>
          {/* @ts-ignore */}
          <button data-testid="button" onClick={() => setState({ age: 75 })}>
            Update
          </button>
        </>
      );
    };
    const TestComponent2 = () => {
      const [{ age }, setState] = useStore(["name", "age"]);
      return (
        <>
          <div data-testid="age">{age}</div>
          <button
            data-testid="button2"
            onClick={() => setState({ name: "Baby Yoda" })}
          >
            Update
          </button>
        </>
      );
    };
    render(
      <>
        <TestComponent />
        <TestComponent2 />{" "}
      </>
    );
    expect(screen.getByTestId("name").innerHTML).toBe("Grogu");
    expect(screen.getByTestId("age").innerHTML).toBe("50");
    act(() => {
      screen.getByTestId("button").click();
    });
    // will not update the value of age because first componet does not have age as its dependency
    expect(screen.getByTestId("name").innerHTML).toBe("Grogu");
    expect(screen.getByTestId("age").innerHTML).toBe("50");
    act(() => {
      screen.getByTestId("button2").click();
    });
    // will update the value of name because second componet had name as its dependency
    expect(screen.getByTestId("name").innerHTML).toBe("Baby Yoda");
  });
});
