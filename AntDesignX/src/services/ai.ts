import request from "../utils/request";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatCompletionOptions {
  model?: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  system_fingerprint: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    logprobs: null;
    finish_reason: string | null;
  }>;
}

const DEEPSEEK_CONFIG = {
  baseURL: "https://api.deepseek.com/v1",
  model: "deepseek-chat",
};

class AIService {
  private static instance: AIService;
  private apiKey: string = "";

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  setApiKey(key: string) {
    this.apiKey = key;
    request.defaults.headers.common["Authorization"] = `Bearer ${key}`;
    request.defaults.baseURL = DEEPSEEK_CONFIG.baseURL;
  }

  async createChatCompletion(
    options: ChatCompletionOptions,
    callbacks?: {
      onUpdate?: (content: string) => void;
      onFinish?: (content: string) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<void> {
    if (!this.apiKey) {
      throw new Error("API key not set");
    }

    const params = {
      model: options.model || DEEPSEEK_CONFIG.model,
      messages: options.messages,
      stream: options.stream ?? true,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens,
    };

    try {
      const response = await fetch(
        `${DEEPSEEK_CONFIG.baseURL}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(params),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body is null");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let completeContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine === "data: [DONE]") continue;

          if (trimmedLine.startsWith("data: ")) {
            try {
              const jsonStr = trimmedLine.slice(5).trim();
              const json: ChatCompletionResponse = JSON.parse(jsonStr);
              const content = json.choices[0]?.delta?.content;

              if (content) {
                completeContent += content;
                callbacks?.onUpdate?.(completeContent);
              }
            } catch (e) {
              console.warn("Failed to parse SSE message:", e);
            }
          }
        }
      }

      callbacks?.onFinish?.(completeContent);
    } catch (error) {
      callbacks?.onError?.(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }
}

export const aiService = AIService.getInstance();
export default aiService;
