import { useState, useEffect } from "react";
import "./index.scss";
import { MenuOutlined } from "@ant-design/icons";
import Sider from "../../components/Sider";

const Layout = () => {
  const [hidden, setHidden] = useState(window.innerWidth >= 768);
  const ToggleMenu = () => {
    setHidden((s) => !s);
  };
  useEffect(() => {
    const handleResize = () => {
      setHidden(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
          width: "100%", // 使用固定的100%宽度，而不是可能超出屏幕的计算值
        }}
      >
        {hidden && <div className="mask" onClick={() => ToggleMenu()}></div>}
        <div className="header">
          <div className="menu">
            <MenuOutlined onClick={() => ToggleMenu()} className="icon" />
            <span>DeepSeek</span>
          </div>
        </div>
        <div className="welcome">有什么可以帮忙的？</div>
        {/* <div className="content">
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
          <h1>有什么可以帮忙的？</h1>
        </div> */}
      </main>
    </div>
  );
};

export default Layout;
