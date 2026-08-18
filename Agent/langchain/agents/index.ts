import { MemorySaver, StateSchema } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent, createMiddleware, tool } from "langchain";
import * as z from "zod";
// 自定义一个工具函数，用于获取指定城市的天气信息
const getWeather = tool((input) => `${input.city}的天气永远是晴天！`, {
  name: "get_weather",
  description: "获取指定城市的天气",
  schema: z.object({
    city: z.string().describe("要查询天气的城市"),
  }),
});
// 定义一个响应格式，用于返回天气信息和置信度
const Answer = z.object({
  summary: z.string(),
  confidence: z.number(),
});

// 定义一个状态模式，用于记录用户ID和调用次数
const MyState = new StateSchema({
  userId: z.string().describe("用户ID"),
  callCount: z.number().describe("调用次数"),
});

// 创建一个状态中间件，用于扩展智能体的状态
const stateMiddleware = createMiddleware({
  name: "StateExtension",
  stateSchema: MyState,
});
// 创建一个 ChatOpenAI 模型实例，使用 deepseek-v4-flash 模型，并设置 API Key 和 Base URL
const model = new ChatOpenAI({
  model: "deepseek-v4-flash",
  apiKey: process.env.OPENAI_API_KEY,
  configuration: { baseURL: process.env.OPENAI_API_BASE_URL },
  modelKwargs: { enable_thinking: false },
});

const contextSchema = z.object({
  userId: z.string().describe("用户ID"),
});
// 创建一个智能体实例，传入模型和工具函数，并指定响应格式
const agent = createAgent({
  model,
  tools: [getWeather],
  responseFormat: Answer,
  middleware: [stateMiddleware],
  contextSchema,
  checkpointer: new MemorySaver(),
});

const res = await agent.invoke(
  {
    messages: [{ role: "user", content: "你好啊" }],
  },
  {
    configurable: { thread_id: crypto.randomUUID() },
    context: { userId: "user_123" },
  },
);

console.log(res.structuredResponse);
