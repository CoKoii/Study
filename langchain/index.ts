import "dotenv/config";
import { initChatModel } from "langchain";

const model = initChatModel("deepseek-chat", {
  modelProvider: "deepseek",
  apiKey: process.env.API_KEY,
  maxRetries: 3,
  configuration: {
    baseURL: process.env.BASE_URL,
  },
});
