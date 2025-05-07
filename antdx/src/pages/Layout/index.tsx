import { useState } from "react";
import "./index.scss";
import { MenuOutlined } from "@ant-design/icons";
import Sider from "../../components/Sider";
const Layout = () => {
  const [hidden, setHidden] = useState(true);
  const ToggleMenu = () => {
    setHidden((s) => !s);
  };

  return (
    <div
      className="layout"
      style={{
        transform: hidden ? "translateX(0)" : "translateX(-300px)",
        width: hidden ? "100%" : "calc(100% + 300px)",
      }}
    >
      <nav
        className="left"
        style={{
          flex: hidden ? 5 : 0,
        }}
      >
        <Sider></Sider>
      </nav>
      <main
        className="right"
        style={{
          flex: hidden ? 43 : 1,
        }}
      >
        {hidden && <div className="mask" onClick={() => ToggleMenu()}></div>}
        <div className="header">
          <div className="menu">
            <MenuOutlined onClick={() => ToggleMenu()} />
            <span>DeepSeek</span>
          </div>
        </div>
        <div
          className="welcome"
          style={{ paddingRight: !hidden ? 0 : "300px" }}
        >
          有什么可以帮忙的？
        </div>
        {/* <div className="content">有什么可以帮忙的？</div> */}
      </main>
    </div>
  );
};

export default Layout;
