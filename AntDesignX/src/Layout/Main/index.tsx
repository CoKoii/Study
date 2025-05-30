import { Welcome } from "@ant-design/x";
import { Button, Space } from "antd";
import { ShareAltOutlined, EllipsisOutlined } from "@ant-design/icons";
import Sender from "../../components/Sender";
import "./index.css";
const Main = () => {
  return (
    <div className="main">
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hello, I'm Ant Design X"
        description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
        extra={
          <Space>
            <Button icon={<ShareAltOutlined />} />
            <Button icon={<EllipsisOutlined />} />
          </Space>
        }
      />
      <Sender />
    </div>
  );
};
export default Main;
