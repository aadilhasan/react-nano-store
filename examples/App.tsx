import React, { useState } from "react";
import { createStore } from "../lib";

const useContext = createStore({
  count1: 1,
  count2: 1,
});

const context = React.createContext<
  [
    {
      count1: number;
      count2: number;
    },
    (partialState: any) => void
  ]
>([
  {
    count1: 1,
    count2: 1,
  },
  () => {},
]);

const Provider = ({ children }: any) => {
  const [count, setCount] = useState({
    count1: 1,
    count2: 1,
  });

  const update = (partialState: any) => {
    setCount((prev) => ({ ...prev, ...partialState }));
  };
  return (
    <context.Provider value={[{ ...count }, update]}>
      {" "}
      {children}{" "}
    </context.Provider>
  );
};

const CompOne = () => {
  const [{ count1 }, updated] = useContext(["count1"]);
  return (
    <button onClick={() => updated({ count1: count1 + 1 })}> {count1} </button>
  );
};

const CompTwo = () => {
  const [{ count2 }, updated] = useContext(["count2"]);
  return (
    <button onClick={() => updated({ count2: count2 + 1 })}> {count2} </button>
  );
};

const CompOneCtx = () => {
  const [{ count1 }, updated] = React.useContext(context);
  return (
    <button onClick={() => updated({ count1: count1 + 1 })}> {count1} </button>
  );
};

const CompTwoCtx = () => {
  const [{ count2 }, updated] = React.useContext(context);
  return (
    <button onClick={() => updated({ count2: count2 + 1 })}> {count2} </button>
  );
};

function App() {
  return (
    <div className="App">
      <h2> With Nano store </h2>
      <CompOne />
      <br />
      <br />
      <CompTwo />
      <br />
      <br />
      <hr />
      <br />
      <br />
      <h2> With React context </h2>
      <h4>change in one component re-renders other component as well</h4>
      <h4>Also needs a lot of boilerplate code for basic state </h4>
      <br />
      <Provider>
        <CompOneCtx />
        <br />
        <br />
        <CompTwoCtx />
      </Provider>
    </div>
  );
}

export default App;
