import { type FC } from "react";
import { Bubble, useXAgent, useXChat } from "@ant-design/x";
import { Flex, App } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Sender from "../../components/Sender";
import aiService from "../../services/ai";
import { markdownRenderer } from "../../components/MarkdownMessage";
import "./index.css";

const userAvatar: React.CSSProperties = {
  color: "#fff",
  backgroundColor: "#87d068",
};

const assistantAvatar: React.CSSProperties = {
  color: "#fff",
  backgroundColor: "#1677ff",
};

const Chat: FC = () => {
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onUpdate, onError }) => {
      if (!message) return;

      try {
        aiService.setApiKey(import.meta.env.VITE_DEEPSEEK_API_KEY);

        await aiService.createChatCompletion(
          {
            messages: [{ role: "user", content: message }],
            stream: true,
          },
          {
            onUpdate: (content) => onUpdate(content),
            onFinish: (content) => onSuccess(content),
            onError: (error) => onError(error),
          }
        );
      } catch (error) {
        onError(error instanceof Error ? error : new Error("请求失败"));
      }
    },
  });

  const { onRequest, messages } = useXChat({
    agent,
    requestPlaceholder: "思考中...",
    requestFallback: "抱歉，请求失败，请稍后重试。",
  });

  return (
    <div className="chat-container">
      <div className="messages">
        <Flex gap="middle" vertical>
          {messages.map(({ id, message, status }) => (
            <Bubble
              key={id}
              placement={status === "local" ? "end" : "start"}
              content={message}
              avatar={{
                icon: <UserOutlined />,
                style: status === "local" ? userAvatar : assistantAvatar,
              }}
              messageRender={status !== "local" ? markdownRenderer : undefined}
              typing={status === "loading"}
            />
          ))}
        </Flex>
      </div>
      <div className="chat-input">
        <App>
          <Sender onRequest={onRequest} isRequesting={agent.isRequesting()} />
        </App>
      </div>
    </div>
  );
};

export default Chat;
