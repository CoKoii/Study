import { type FC } from "react";
import { useParams } from "react-router-dom";
import { Bubble } from "@ant-design/x";
import { Flex } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Sender from "../../components/Sender";
import "./index.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const userAvatar: React.CSSProperties = {
  color: "#fff",
  backgroundColor: "#87d068",
};

const assistantAvatar: React.CSSProperties = {
  color: "#fff",
  backgroundColor: "#1677ff",
};

const mockMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "你好，请介绍一下你自己。",
    timestamp: 1732204800000,
  },
  {
    id: "2",
    role: "assistant",
    content:
      "你好！我是基于 Ant Design 打造的智能助手，可以为你提供各种帮助。有什么我可以帮你的吗？",
    timestamp: 1732204860000,
  },
  {
    id: "3",
    role: "user",
    content: "你能做些什么呢？",
    timestamp: 1732204920000,
  },
  {
    id: "4",
    role: "assistant",
    content:
      "我可以：\n1. 回答你的问题\n2. 帮助你解决编程问题\n3. 提供创意建议\n4. 协助文档撰写\n等等。你可以尝试问我任何问题！",
    timestamp: 1732204980000,
  },
];

const Chat: FC = () => {
  const { id } = useParams();
  console.log("Current chat id:", id);

  return (
    <div className="chat-container">
      <div className="messages">
        <Flex gap="middle" vertical>
          {mockMessages.map((message) => (
            <Bubble
              key={message.id}
              placement={message.role === "user" ? "end" : "start"}
              content={message.content}
              avatar={{
                icon: <UserOutlined />,
                style: message.role === "user" ? userAvatar : assistantAvatar,
              }}
            />
          ))}
        </Flex>
      </div>
      <div className="chat-input">
        <Sender />
      </div>
    </div>
  );
};

export default Chat;
