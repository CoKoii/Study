import "dotenv/config";
import { createAgent, initChatModel, tool } from "langchain";
import * as z from "zod";

const getWeather = tool(
  async ({ city }) => `当前${city}的天气是晴朗，温度25°C。`,
  {
    name: "get_weather",
    description: "获取指定城市的当前天气。",
    schema: z.object({
      city: z.string().describe("要查询天气的城市，例如：北京、上海"),
    }),
  },
);
const model = await initChatModel("deepseek:deepseek-chat", {
  apiKey: process.env.API_KEY,
  temperature: 0,
  configuration: {
    baseURL: process.env.API_BASE_URL,
  },
});
const structured = z.object({
  city: z.string().describe("要查询天气的城市，例如：北京、上海"),
  temperature: z.string().describe("当前温度，例如：25°C"),
  condition: z.string().describe("天气情况，例如：晴朗、阴天"),
  recommendation: z.string().describe("基于天气的建议，例如：出门带伞、穿外套"),
});
const agent = createAgent({
  model,
  tools: [getWeather],
  systemPrompt:
    "你是一个天气助手。回答天气问题时，优先调用工具获取信息，再用简洁自然的中文回答。",
  responseFormat: structured,
});

const result = await agent.invoke({
  messages: [{ role: "user", content: "北京天气怎么样" }],
});

console.log(result.structuredResponse);
