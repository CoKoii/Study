import { Typography, Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";
const { Title } = Typography;

const Header = () => {
  return (
    <div className="header">
      <Title level={4}>Ant Design X</Title>
      <Button
        size="middle"
        type="primary"
        icon={<MessageOutlined />}
        style={{
          margin: "12px 0 12px 0 ",
          width: "100%",
        }}
      >
        开启新对话
      </Button>
    </div>
  );
};

export default Header;
