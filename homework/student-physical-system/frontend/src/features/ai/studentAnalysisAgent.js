import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { exportStudentsCsv } from '../../utils/exportCsv'
import { createStudent, deleteStudent, fetchStudent, fetchStudents, updateStudent } from '../../api/student'

const studentSchema = z.object({
  stuNo: z.string().describe('学号'),
  stuName: z.string().describe('姓名'),
  gender: z.enum(['男', '女']).describe('性别'),
  age: z.number().describe('年龄'),
  className: z.string().describe('班级'),
  height: z.number().describe('身高，单位 cm'),
  weight: z.number().describe('体重，单位 kg'),
  score: z.number().describe('体测成绩')
})

const studentPatchSchema = studentSchema
  .omit({ stuNo: true })
  .partial()
  .describe('需要修改的学生字段；只传用户明确要求修改的字段')

const studentLocatorSchema = z.object({
  stuNo: z.string().optional().describe('学生学号；用户提供学号时优先使用'),
  keyword: z.string().optional().describe('学生姓名或搜索关键词；用户只提供姓名时使用')
})

function toolResult(payload) {
  return JSON.stringify(payload)
}

async function resolveStudent({ stuNo, keyword }) {
  if (stuNo) {
    const result = await fetchStudent(stuNo)
    return { record: result.data }
  }

  const result = await fetchStudents({
    keyword: keyword || '',
    pageNum: 1,
    pageSize: 20
  })
  const records = result.data.records || []

  if (records.length === 1) {
    return { record: records[0] }
  }
  return {
    needsConfirmation: true,
    candidates: records,
    message: records.length ? '找到多个匹配学生，请让用户确认学号。' : '没有找到匹配学生，请让用户提供更准确的信息。'
  }
}

export const studentAnalysisTools = [
  tool(
    async () => {
      const totalResult = await fetchStudents({ pageNum: 1, pageSize: 1 })
      const total = totalResult.data.total || 0
      const result = await fetchStudents({
        pageNum: 1,
        pageSize: Math.max(total, 1)
      })
      return toolResult({
        records: result.data.records || [],
        total
      })
    },
    {
      name: 'get_students',
      description:
        '读取系统内全部学生体质数据。需要查看、筛选、排序、统计、比较或分析学生记录时先调用本工具，再基于返回的完整 records 自行筛选和计算。返回 records 和 total，records 字段包含学号、姓名、性别、年龄、班级、身高、体重、BMI、体测成绩等数据。',
      schema: z.object({})
    }
  ),
  tool(
    async (locator) => {
      return toolResult(await resolveStudent(locator))
    },
    {
      name: 'get_student',
      description:
        '读取单个学生详情。可以按学号精确读取，也可以按姓名/关键词搜索；唯一匹配时返回学生，多个匹配时返回候选让用户确认。',
      schema: studentLocatorSchema
    }
  ),
  tool(
    async ({ student }) => {
      const result = await createStudent(student)
      return toolResult({ record: result.data })
    },
    {
      name: 'create_student',
      description: '新增学生体质信息。只有用户明确要求新增学生且提供完整字段时使用。',
      schema: z.object({
        student: studentSchema
      })
    }
  ),
  tool(
    async ({ stuNo, keyword, changes }) => {
      const resolved = await resolveStudent({ stuNo, keyword })
      if (!resolved.record) {
        return toolResult(resolved)
      }
      const current = resolved.record
      const payload = {
        ...current,
        ...changes,
        stuNo: current.stuNo
      }
      const result = await updateStudent(current.stuNo, payload)
      return toolResult({ record: result.data })
    },
    {
      name: 'update_student',
      description:
        '修改学生体质信息。可按学号或姓名/关键词定位学生；唯一匹配时自动修改，多个匹配时返回候选让用户确认。只传用户明确要求修改的字段，工具会自动保留其它当前字段。',
      schema: z.object({
        stuNo: z.string().optional().describe('需要修改的学生学号；用户提供学号时优先使用'),
        keyword: z.string().optional().describe('学生姓名或搜索关键词；用户只提供姓名时使用'),
        changes: studentPatchSchema
      })
    }
  ),
  tool(
    async (locator) => {
      const resolved = await resolveStudent(locator)
      if (!resolved.record) {
        return toolResult(resolved)
      }
      await deleteStudent(resolved.record.stuNo)
      return toolResult({ stuNo: resolved.record.stuNo })
    },
    {
      name: 'delete_student',
      description:
        '删除学生体质信息。可按学号或姓名/关键词定位学生；唯一匹配时删除，多个匹配时返回候选让用户确认。',
      schema: studentLocatorSchema
    }
  ),
  tool(
    async ({ filename = 'student-ai-export.csv', records }) => {
      const exportRecords = Array.isArray(records) ? records : []
      exportStudentsCsv(exportRecords, filename)
      return toolResult({
        filename,
        count: exportRecords.length
      })
    },
    {
      name: 'export_students_csv',
      description:
        '将学生记录导出为 CSV 文件。适用于用户要求导出、下载或保存筛选结果时。records 应传入已经根据用户条件整理好的记录数组。',
      schema: z.object({
        filename: z.string().optional().describe('导出的文件名，建议以 .csv 结尾'),
        records: z.array(z.record(z.string(), z.any())).describe('需要导出的学生记录数组')
      })
    }
  )
]
