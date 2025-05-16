import { createContext, useContext } from "react";

const MsgContext = createContext("");
const A = () => {
  return (
    <div>
      这是a组件
      <B />
    </div>
  );
};
const B = () => {
  const msg = useContext(MsgContext);
  return <div>这是b组件{msg}</div>;
};
const App = () => {
  return (
    <div>
      <MsgContext.Provider value={"hello"}>
        <p>App</p>
        <A />
      </MsgContext.Provider>
    </div>
  );
};
export default App;
