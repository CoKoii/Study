import "dotenv/config";
import { initChatModel } from "langchain";
import { z } from "zod";

const movieSchema = z.object({
  title: z.string().describe("电影的标题"),
  director: z.string().describe("电影的导演"),
  releaseYear: z.number().describe("电影的上映年份"),
  genre: z.string().describe("电影的类型"),
  description: z.string().describe("电影的简介"),
});

async function main() {
  const llm = await initChatModel("deepseek-chat", {
    apiKey: process.env.DEEPSEEK_API_KEY,
    modelProvider: "deepseek",
    temperature: 0,
    maxRetries: 1,
    configuration: {
      baseURL: process.env.DEEPSEEK_API_BASE_URL,
    },
  });

  const structuredModel = llm.withStructuredOutput(movieSchema, {
    name: "movie_info",
  });

  const result = await structuredModel.invoke(
    "请介绍电影《肖申克的救赎》，并严格按给定结构返回。",
  );

  console.log(result);
}

main().catch(console.error);
