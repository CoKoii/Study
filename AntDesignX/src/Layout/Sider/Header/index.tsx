import { Typography, Button } from "antd";
import "./index.css";
import { MessageOutlined } from "@ant-design/icons";
const { Title } = Typography;
const Header = () => {
  return (
    <div className="header">
      <Title level={3}>Ant Design X</Title>
      <Button
        size="large"
        type="primary"
        icon={<MessageOutlined />}
        style={{
          width: "60%",
          margin: "24px 0 0 0",
        }}
      >
        开启新对话
      </Button>
    </div>
  );
};
export default Header;
