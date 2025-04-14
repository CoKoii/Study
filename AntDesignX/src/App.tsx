import React from "react";
import { Outlet } from "react-router-dom";
import Sider from "./Layout/Sider";
import "./App.css";

const App: React.FC = () => (
  <div className="App">
    <div className="sider">
      <Sider></Sider>
    </div>
    <div className="main">
      <Outlet />
    </div>
  </div>
);

export default App;
