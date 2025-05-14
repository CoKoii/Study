import { useState } from "react";

const App = () => {
  const [count, setcount] = useState(0);
  const add = () => {
    setcount((prev) => prev + 1);
  };
  return (
    <div>
      <button onClick={add}>{count}</button>
    </div>
  );
};
export default App;
