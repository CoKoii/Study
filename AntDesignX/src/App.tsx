import React from "react";
import Sider from "./Layout/Sider";
import Main from "./Layout/Main";
import "./App.css";
const App: React.FC = () => (
  <div className="App">
    <div className="sider">
      <Sider></Sider>
    </div>
    <div className="main">
      <Main></Main>
    </div>
  </div>
);

export default App;
