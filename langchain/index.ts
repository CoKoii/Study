import "dotenv/config";
import { createAgent, initChatModel } from "langchain";

const model = await initChatModel("deepseek-chat", {
  modelProvider: "deepseek",
  apiKey: process.env.API_KEY,
  maxRetries: 3,
  configuration: {
    baseURL: process.env.BASE_URL,
  },
});
const llm = createAgent({
  model,
});
const response = await llm.invoke({
  messages: [{ role: "user", content: "Hello, how are you?" }],
});

const lastMessage = response.messages[response.messages.length - 1];
console.log(lastMessage?.content);
