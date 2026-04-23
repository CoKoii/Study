import "dotenv/config";
import { traceable } from "langsmith/traceable";
import { wrapOpenAI } from "langsmith/wrappers";
import OpenAI from "openai";

const client = wrapOpenAI(
  new OpenAI({
    baseURL: process.env.BASE_URL,
  }),
);

const assistant = traceable(async function assistant(question: string) {
  const response = await client.chat.completions.create({
    model: "gpt-5.4",
    messages: [{ role: "user", content: question }],
  });
  return response.choices[0]?.message?.content ?? null;
});

(async () => {
  console.log(await assistant("你好,你是什么模型?"));
})();
