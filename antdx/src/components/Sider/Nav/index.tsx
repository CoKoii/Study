import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { ConversationsProps } from "@ant-design/x";
import { Conversations } from "@ant-design/x";
import { App, type GetProp, Space, theme } from "antd";

const items: GetProp<ConversationsProps, "items"> = [
  {
    key: "item1",
    label: "对话 1",
    timestamp: 1732204800000,
    group: "今天",
  },
  {
    key: "item2",
    label: "对话 2",
    timestamp: 1732204860000,
    group: "今天",
  },
  {
    key: "item3",
    label: "对话 3",
    timestamp: 1732204920000,
    group: "今天",
  },
  {
    key: "item4",
    label: "对话 4",
    timestamp: 1732204980000,
    group: "今天",
  },
  {
    key: "item5",
    label: "对话 5",
    timestamp: 1732118400000,
    group: "昨天",
  },
  {
    key: "item6",
    label: "对话 6",
    timestamp: 1732118460000,
    group: "昨天",
  },
];

const Nav = () => {
  const { message } = App.useApp();
  const { token } = theme.useToken();

  const style = {
    height: "calc(100vh - 150px)", // 调整高度以适应侧边栏
    background: "#FAFAFA",
    borderRadius: token.borderRadius,
    margin: "0",
    overflow: "auto",
    padding: 0,
  };

  const groupable: GetProp<typeof Conversations, "groupable"> = {
    sort(a, b) {
      if (a === b) return 0;
      return a === "今天" ? -1 : 1;
    },
    title: (group, { components: { GroupTitle } }) =>
      group ? (
        <GroupTitle>
          <Space>
            <CommentOutlined />
            <span>{group}</span>
          </Space>
        </GroupTitle>
      ) : (
        <GroupTitle />
      ),
  };

  const menuConfig: ConversationsProps["menu"] = (conversation) => ({
    items: [
      {
        label: "编辑对话",
        key: "edit",
        icon: <EditOutlined />,
      },
      {
        label: "删除对话",
        key: "delete",
        icon: <DeleteOutlined />,
        danger: true,
      },
    ],
    onClick: (menuInfo) => {
      menuInfo.domEvent.stopPropagation();
      message.info(`点击了 ${conversation.label} - ${menuInfo.key}`);
    },
  });

  return (
    <Conversations
      style={style}
      groupable={groupable}
      defaultActiveKey="item1"
      items={items}
      menu={menuConfig}
    />
  );
};

export default Nav;
