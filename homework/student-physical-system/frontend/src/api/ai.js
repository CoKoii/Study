import { ChatOpenAI } from '@langchain/openai'
import { createAgent } from 'langchain'
import { studentAnalysisTools } from '../features/ai/studentAnalysisAgent'

const model = new ChatOpenAI({
  model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-5.4',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  temperature: 0.2,
  streaming: true,
  configuration: {
    baseURL: `${import.meta.env.VITE_OPENAI_BASE_URL}/v1`,
    dangerouslyAllowBrowser: true
  }
})

const agent = createAgent({
  model,
  tools: studentAnalysisTools,
  systemPrompt: '你是学生体质数据分析助手。需要统计、比较、排序、筛选、导出或修改学生数据时，必须先调用 get_students 读取系统内全部学生数据，再基于完整 records 自行筛选、排序和计算；不要基于当前页面可见行、部分数据或记忆猜测。回答要简洁，直接给出结论和关键数据。'
})

const mutationToolNames = new Set(['create_student', 'update_student', 'delete_student'])
const toolSummaries = {
  get_students: (result) => `已读取全部 ${result.total ?? result.records?.length ?? 0} 条学生数据`,
  get_student: (result) => result.record?.stuNo ? `已读取学号 ${result.record.stuNo}` : '已读取学生数据',
  create_student: (result) => result.record?.stuNo ? `已新增学号 ${result.record.stuNo}` : '已新增学生',
  update_student: (result) => result.record?.stuNo ? `已更新学号 ${result.record.stuNo}` : '已更新学生',
  delete_student: (result) => result.stuNo ? `已删除学号 ${result.stuNo}` : '已删除学生',
  export_students_csv: (result) => `已导出 ${result.count || 0} 条学生数据`
}

export async function streamAiChat({ messages, onDelta = () => {}, onToolCall = () => {}, onChanged = () => {} }) {
  const run = await agent.streamEvents(
    { messages: messages.map(toAgentMessage) },
    { version: 'v3' }
  )

  await Promise.all([
    streamMessages(run, onDelta),
    streamToolCalls(run, onToolCall, onChanged)
  ])

  const state = await run.output
  return state.messages.map((message) => ({ raw: message }))
}

async function streamMessages(run, onDelta) {
  for await (const message of run.messages) {
    for await (const token of message.text) {
      if (token) {
        onDelta(token)
      }
    }
  }
}

async function streamToolCalls(run, onToolCall, onChanged) {
  for await (const call of run.toolCalls) {
    onToolCall({ name: call.name, status: 'running', summary: '正在处理数据' })
    const output = await call.output
    onToolCall({ name: call.name, status: 'done', summary: getToolSummary(call.name, output) })
    if (mutationToolNames.has(call.name)) {
      onChanged()
    }
  }
}

function toAgentMessage(message) {
  return message.raw || {
    role: message.role === 'assistant' ? 'assistant' : 'user',
    content: message.content
  }
}

function getToolSummary(name, output) {
  const result = parseToolOutput(output)
  if (result.needsConfirmation) {
    return '需要确认学生'
  }
  return toolSummaries[name]?.(result) || '操作完成'
}

function parseToolOutput(output) {
  try {
    return typeof output === 'string' ? JSON.parse(output) : output || {}
  } catch (error) {
    return {}
  }
}
