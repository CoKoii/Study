import Header from "./Header";
import Nav from "./Nav";
import { App } from "antd";
import "./index.scss";

const Sider = () => {
  return (
    <div className="sider-container">
      <App>
        <Header />
        <Nav />
      </App>
    </div>
  );
};

export default Sider;
