import "dotenv/config";
import { createAgent, createMiddleware, initChatModel, tool } from "langchain";
import { z } from "zod";

const getWeather = tool(
  async ({ location }) => {
    return `${location}的天气是晴天，温度25摄氏度。`;
  },
  {
    name: "get_weather",
    description: "获取指定位置的天气信息",
    schema: z.object({
      location: z.string().describe("要查询天气的地理位置"),
    }),
  },
);

const choiceClothes = tool(
  async ({ weather }) => {
    if (weather.includes("晴天")) {
      return "建议穿短袖和短裤。";
    } else if (weather.includes("雨天")) {
      return "建议穿雨衣和带伞。";
    } else if (weather.includes("寒冷")) {
      return "建议穿厚外套和保暖衣物。";
    } else {
      return "建议根据天气情况选择合适的衣物。";
    }
  },
  {
    name: "choice_clothes",
    description: "根据天气情况推荐穿着",
    schema: z.object({
      weather: z.string().describe("天气信息"),
    }),
  },
);

const basicModel = await initChatModel("deepseek-chat", {
  apiKey: process.env.API_KEY,
  modelProvider: "deepseek",
  temperature: 0,
  configuration: {
    baseURL: process.env.API_BASE_URL,
  },
});

const advancedModel = await initChatModel("deepseek-chat", {
  apiKey: process.env.API_KEY,
  modelProvider: "deepseek",
  temperature: 0,
  configuration: {
    baseURL: process.env.API_BASE_URL,
  },
});

const switchModelMiddleware = createMiddleware({
  name: "switch-model",
  wrapModelCall: async (request, handler) => {
    const msgCount = request.state.messages.length;

    request.model = msgCount >= 3 ? advancedModel : basicModel;
    return handler(request);
  },
});

const dynamicPromptMiddleware = createMiddleware({
  name: "dynamic-prompt",
  wrapModelCall: async (request, handler) => {
    const userType = request.runtime.context?.user_type ?? "normal";

    const prompt =
      userType === "vip"
        ? "你是一名高质量客服助手。回答前先称呼：尊贵的VIP客户你好，然后再清晰、完整地回答问题。"
        : "你是一名简洁助手。直接回答问题，不需要称呼和客套。";

    return handler({
      ...request,
      systemMessage: request.systemMessage.concat(`\n${prompt}`),
    });
  },
});
const handler_tool_errors = createMiddleware({
  name: "handle-tool-errors",
  wrapToolCall: async (request, handler) => {
    try {
      return await handler(request);
    } catch (error) {
      return `工具调用失败，错误信息：${error.message}`;
    }
  },
});

const agent = createAgent({
  model: basicModel,
  tools: [getWeather, choiceClothes],
  middleware: [
    switchModelMiddleware,
    dynamicPromptMiddleware,
    handler_tool_errors,
  ],
});

const response = await agent.invoke(
  {
    messages: [{ role: "user", content: "北京明天穿什么衣服" }],
  },
  {
    context: {
      user_type: "vip",
    },
  },
);
// console.log(response.messages);

console.log(response.messages[response.messages.length - 1].content);
