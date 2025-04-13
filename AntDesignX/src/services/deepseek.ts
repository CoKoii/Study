import axios from "axios";

// DeepSeek API的配置 - 直接设置API密钥而非使用环境变量
const API_URL = "https://api.deepseek.com/v1/chat/completions"; // 这是示例URL，请替换为实际的DeepSeek API URL
const API_KEY = "sk-8171cf6e376e4752bff05bc7e8a2ccb6"; // 直接设置您的API密钥

// 定义消息类型
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

// DeepSeek请求参数接口
export interface DeepSeekRequestParams {
  messages: Message[];
  model?: string; // 可选的模型参数，如果不提供则使用默认值
  temperature?: number;
  max_tokens?: number;
}

// DeepSeek响应接口
export interface DeepSeekResponse {
  id: string;
  choices: {
    message: Message;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 发送请求到DeepSeek API
 * @param params 请求参数
 * @returns DeepSeek的响应
 */
export async function chatWithDeepSeek(
  params: DeepSeekRequestParams
): Promise<string> {
  try {
    // 默认配置
    const defaultParams = {
      model: "deepseek-chat", // 替换为您实际使用的模型名称
      temperature: 0.7,
      max_tokens: 2000,
    };

    // 合并默认配置和用户提供的参数
    const requestParams = { ...defaultParams, ...params };

    const response = await axios.post<DeepSeekResponse>(
      API_URL,
      requestParams,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    // 返回模型生成的回复内容
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("DeepSeek API调用失败:", error);
    throw new Error("无法连接到DeepSeek服务");
  }
}

/**
 * 创建一个格式化的用户消息对象
 * @param content 用户消息内容
 * @returns 格式化的消息对象
 */
export function createUserMessage(content: string): Message {
  return {
    role: "user",
    content,
  };
}

/**
 * 创建一个格式化的系统消息对象
 * @param content 系统消息内容
 * @returns 格式化的消息对象
 */
export function createSystemMessage(content: string): Message {
  return {
    role: "system",
    content,
  };
}

/**
 * 处理用户输入并获取DeepSeek的响应
 * @param userInput 用户输入
 * @param conversationHistory 对话历史
 * @returns DeepSeek的响应
 */
export async function getDeepSeekResponse(
  userInput: string,
  conversationHistory: Message[] = []
): Promise<string> {
  // 创建当前用户消息
  const userMessage = createUserMessage(userInput);

  // 构建完整的消息历史
  const messages = [
    createSystemMessage(
      "你是一个由DeepSeek提供支持的AI助手，请提供有用、安全、准确的信息。"
    ),
    ...conversationHistory,
    userMessage,
  ];

  // 调用DeepSeek API
  return chatWithDeepSeek({ messages });
}
