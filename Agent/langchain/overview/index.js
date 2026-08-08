import { createAgent, tool } from "langchain";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";
import * as z from "zod";

const getWeather = tool((input) => `${input.city}的天气永远是晴天！`, {
  name: "get_weather",
  description: "获取指定城市的天气",
  schema: z.object({
    city: z.string().describe("要查询天气的城市"),
  }),
});
const model = new ChatOpenAI({
  model: "deepseek-v4-flash",
  apiKey: process.env.OPENAI_API_KEY,
  configuration: { baseURL: process.env.OPENAI_API_BASE_URL },
});
const agent = createAgent({
  model,
  tools: [getWeather],
});

console.log(
  await agent.invoke({
    messages: [
      { role: "user", content: "旧金山的天气怎么样？" },
    ],
  }),
);
