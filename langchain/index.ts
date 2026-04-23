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
const chunck = await llm.stream({
  messages: [{ role: "user", content: "Hello, how are you?" }],
});

for await (const part of chunck) {
  console.log(part);
}
