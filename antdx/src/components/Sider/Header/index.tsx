import { Typography, Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";
const { Title } = Typography;

const Header = () => {
  return (
    <div className="header" style={{ padding: "0px 0" }}>
      <Title level={3}>Ant Design X</Title>
      <Button
        size="large"
        type="primary"
        icon={<MessageOutlined />}
        style={{
          margin: "24px 0 24px 0 ",
        }}
      >
        开启新对话
      </Button>
    </div>
  );
};

export default Header;
