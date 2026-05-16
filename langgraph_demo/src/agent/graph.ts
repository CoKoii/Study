import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import { z } from "zod";

const llm = new ChatOpenAI({
  model: "gpt-5.4",
  temperature: 0.8,
  apiKey: "sk-JdLOOlKkbmk7Fdj2Ue8QkH5gusAEzG5x8ZHERJl6SwGMwRqk",
  configuration: {
    baseURL: "https://api2.gemai.cc/v1",
  },
});

const getWeather = tool(
  async ({ city }) => {
    return `${city} 总是阳光明媚！`;
  },
  {
    name: "get_weather",
    description: "获取指定城市的天气。",
    schema: z.object({
      city: z.string().describe("要查询天气的城市。"),
    }),
  },
);

export const graph = createAgent({
  model: llm,
  tools: [getWeather],
  systemPrompt: "你是一个乐于助人的助手",
});

export default graph;
