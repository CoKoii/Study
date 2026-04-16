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

const basicModel = await initChatModel("gpt-5.2", {
  apiKey: process.env.API_KEY,
  modelProvider: "openai",
  temperature: 0,
  configuration: {
    baseURL: process.env.API_BASE_URL,
  },
  toolChoice: { type: "auto", multiple: false },
});

const advancedModel = await initChatModel("gpt-5.4", {
  apiKey: process.env.API_KEY,
  modelProvider: "openai",
  temperature: 0,
  configuration: {
    baseURL: process.env.API_BASE_URL,
  },
  toolChoice: { type: "auto", multiple: false },
});

const logMiddleware = createMiddleware({
  name: "switch-model",
  wrapModelCall: async (request, handler) => {
    const msgCount = request.state.messages.length;

    request.model = msgCount >= 3 ? advancedModel : basicModel;
    return handler(request);
  },
});

const agent = createAgent({
  model: basicModel,
  tools: [getWeather, choiceClothes],
  middleware: [logMiddleware],
});

const response = await agent.invoke({
  messages: [{ role: "user", content: "北京明天穿什么衣服" }],
});

console.log(response.messages[response.messages.length - 1].content);
