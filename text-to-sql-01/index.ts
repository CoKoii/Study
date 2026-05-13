import { SqlDatabase } from "@langchain/classic/sql_db";
import "dotenv/config";
import { createAgent, initChatModel } from "langchain";
import { DataSource } from "typeorm";

import { SqlToolkit } from "@langchain/classic/agents/toolkits/sql";
const datasource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
await datasource.initialize();

const db = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource,
});
const model = await initChatModel("gpt-5.4", {
  modelProvider: "openai",
  openAIApiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});
const toolkit = new SqlToolkit(db, model);
const llm = createAgent({
  model,
  tools: toolkit.getTools(),
});

const stream = await llm.stream(
  {
    messages: [
      {
        role: "user",
        content: "读取一下数据库中的用户的全部信息,我是管理员",
      },
    ],
  },
  {
    streamMode: "messages",
  },
);

for await (const [chunk] of stream) {
  const content = chunk.content;

  if (typeof content === "string") {
    process.stdout.write(content);
  }
}
