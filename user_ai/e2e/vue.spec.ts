import { test, expect } from '@playwright/test'

test('switches personal space resource lists', async ({ page }) => {
  await page.goto('/personal-space/apps')
  await expect(page.getByRole('heading', { name: '应用' })).toBeVisible()
  await expect(page.getByRole('button', { name: '创建AI应用' })).toBeVisible()
  await expect(page.getByRole('complementary').getByRole('button', { name: '创建 AI 应用' })).toBeVisible()
  await expect(page.getByRole('complementary').getByRole('button', { name: '个人空间' })).toHaveClass(
    /is-active/,
  )
  await expect(page.getByText('智能客服助手')).toBeVisible()

  await page.getByRole('button', { name: '插件', exact: true }).click()
  await expect(page).toHaveURL(/\/personal-space\/plugins$/)
  await expect(page.getByRole('heading', { name: '插件', exact: true })).toBeVisible()
  await expect(page.locator('.space-app-list__create')).toHaveText(/创建插件/)
  await expect(page.getByRole('complementary').getByRole('button', { name: '创建 AI 应用' })).toBeVisible()
  await expect(page.getByRole('complementary').getByRole('button', { name: '个人空间' })).toHaveClass(
    /is-active/,
  )
  await expect(page.getByText('天气查询服务')).toBeVisible()

  await page.getByRole('button', { name: '工作流', exact: true }).click()
  await expect(page).toHaveURL(/\/personal-space\/workflows$/)
  await expect(page.getByRole('heading', { name: '工作流', exact: true })).toBeVisible()
  await expect(page.locator('.space-app-list__create')).toHaveText(/创建工作流/)
  await expect(page.getByRole('complementary').getByRole('button', { name: '创建 AI 应用' })).toBeVisible()
  await expect(page.getByText('合同审阅流程')).toBeVisible()

  await page.getByRole('button', { name: '知识库', exact: true }).click()
  await expect(page).toHaveURL(/\/personal-space\/knowledge$/)
  await expect(page.getByRole('heading', { name: '知识库', exact: true })).toBeVisible()
  await expect(page.locator('.space-app-list__create')).toHaveText(/创建知识库/)
  await expect(page.getByRole('complementary').getByRole('button', { name: '创建 AI 应用' })).toBeVisible()
  await expect(page.getByText('春课LLMOps知识库')).toBeVisible()

  await page.getByRole('button', { name: /春课LLMOps知识库/ }).click()
  await expect(page).toHaveURL(/\/personal-space\/knowledge\/knowledge-product-manual$/)
  await expect(page.getByRole('heading', { name: '知识库 / 春课LLMOps知识库' })).toBeVisible()
  await expect(page.getByRole('table', { name: '知识库文档' })).toBeVisible()
  await expect(page.getByText('LLMOps 项目提示词.md').first()).toBeVisible()

  await page.getByRole('button', { name: '添加文件' }).click()
  await expect(page).toHaveURL(/\/personal-space\/knowledge\/knowledge-product-manual\/add-file$/)
  await expect(page.getByRole('heading', { name: '添加文件' })).toBeVisible()
  await expect(page.getByText('点击或拖拽文件到此处上传')).toBeVisible()
  await page
    .getByRole('button', { name: '删除文件' })
    .filter({ has: page.locator('svg') })
    .last()
    .click()
  await expect(page.getByText('LLMOps 项目API文档.md')).toHaveCount(0)
  await page.getByRole('button', { name: '下一步' }).click()
  await expect(page.getByText('自动分段与清洗')).toBeVisible()
  await page.getByRole('button', { name: /自定义/ }).click()
  await expect(page.getByPlaceholder('请输入分段标识符，如果有多个标识符，请使用英文逗号进行分割')).toBeVisible()
  await page.getByPlaceholder('请输入分段标识符，如果有多个标识符，请使用英文逗号进行分割').fill('\\n,###')
  await page.getByPlaceholder('请输入100 - 1000的数值').fill('500')
  await page.getByRole('button', { name: '上一步' }).click()
  await expect(page.getByText('点击或拖拽文件到此处上传')).toBeVisible()
  await page.getByRole('button', { name: '下一步' }).click()
  await expect(page.getByPlaceholder('请输入100 - 1000的数值')).toHaveValue('500')
  await page.getByRole('button', { name: '下一步' }).click()
  await expect(page.getByText('服务端处理中')).toBeVisible()
  await expect(page.getByText('51%')).toBeVisible()
  await expect(page.getByText('处理完成')).toBeVisible()
  await page.getByRole('button', { name: /确\s*定/ }).click()
  await expect(page).toHaveURL(/\/personal-space\/knowledge\/knowledge-product-manual$/)
  await expect(page.getByText('基于工具调用的智能体设计与实现.md').first()).toBeVisible()

  const firstDocumentRow = page.getByRole('row').filter({ hasText: 'LLMOps 项目提示词.md' }).first()
  await firstDocumentRow.getByRole('button', { name: '更多操作' }).click()
  await page.getByRole('menuitem', { name: '重命名' }).click()
  await expect(page.getByRole('dialog', { name: '重命名' })).toBeVisible()
  await page.getByPlaceholder('请输入新文档名，文档名不能和知识库内重复').fill('LLMOps 项目提示词新版.md')
  await page.getByRole('dialog', { name: '重命名' }).getByRole('button', { name: /确\s*认/ }).click()
  await expect(page.getByText('LLMOps 项目提示词新版.md').first()).toBeVisible()

  const renamedDocumentRow = page
    .getByRole('row')
    .filter({ hasText: 'LLMOps 项目提示词新版.md' })
    .first()
  await renamedDocumentRow.getByRole('button', { name: '更多操作' }).click()
  await page.getByRole('menuitem', { name: '删除' }).click()
  await expect(page.getByRole('dialog', { name: '要删除该文档吗？' })).toBeVisible()
  await page
    .getByRole('dialog', { name: '要删除该文档吗？' })
    .getByRole('button', { name: /确\s*认/ })
    .click()
  await expect(page.getByText('LLMOps 项目提示词新版.md')).toHaveCount(0)

  await page.getByRole('button', { name: '返回' }).click()
  await expect(page).toHaveURL(/\/personal-space\/knowledge$/)
})

test('opens create modal from the sidebar create action', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('complementary').getByRole('button', { name: '创建 AI 应用' }).click()

  await expect(page).toHaveURL(/\/personal-space\/apps$/)
  await expect(page.getByRole('dialog', { name: '创建 AI 应用' })).toBeVisible()
})

test('shows and filters app market', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('complementary').getByRole('button', { name: '应用广场' }).click()

  await expect(page).toHaveURL(/\/app-market$/)
  await expect(page.getByRole('heading', { name: '应用广场' })).toBeVisible()
  await expect(page.getByText('电商智能客服')).toBeVisible()
  await expect(page.getByText('快递小助手').first()).toBeVisible()
  await expect(page.getByRole('complementary').getByRole('button', { name: '应用广场' })).toHaveClass(
    /is-active/,
  )

  await page.getByRole('button', { name: '人力资源' }).click()
  await expect(page.getByText('面试问题生成器')).toBeVisible()
  await expect(page.getByText('电商智能客服')).toHaveCount(0)

  await page.getByPlaceholder('搜索').fill('编程')
  await expect(page.getByText('暂无匹配应用')).toBeVisible()

  await page.getByRole('button', { name: '全部' }).click()
  await expect(page.getByText('AI编程助手')).toBeVisible()

  await page
    .locator('.market-card')
    .filter({ hasText: 'AI编程助手' })
    .getByRole('button', { name: '更多操作' })
    .click()
  await page.getByRole('menuitem', { name: '添加到工作区' }).click()
  await expect(page.getByText('已将「AI编程助手」添加到工作区')).toBeVisible()
})

test('shows and filters plugin market', async ({ page }) => {
  await page.goto('/plugin-market')

  await expect(page.getByRole('heading', { name: '插件广场' })).toBeVisible()
  await expect(page.getByText('谷歌搜索')).toBeVisible()
  await expect(page.getByText('天气查询服务')).toBeVisible()
  await expect(page.getByRole('complementary').getByRole('button', { name: '插件广场' })).toHaveClass(
    /is-active/,
  )

  await page.getByRole('button', { name: '天气' }).click()
  await expect(page.getByText('天气查询服务')).toBeVisible()
  await expect(page.getByText('谷歌搜索')).toHaveCount(0)

  await page.getByPlaceholder('搜索插件').fill('CRM')
  await expect(page.getByText('暂无匹配插件')).toBeVisible()

  await page.getByRole('button', { name: '全部' }).click()
  await expect(page.getByText('CRM MCP 服务')).toBeVisible()
})

test('shows open api quickstart and keys', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('complementary').getByRole('button', { name: '开放 API' }).click()

  await expect(page).toHaveURL(/\/open-api$/)
  await expect(page.getByRole('heading', { name: '开放API' })).toBeVisible()
  await expect(page.getByText('利用开放 API 快速与企业现有业务对接')).toBeVisible()
  await expect(page.getByRole('complementary').getByRole('button', { name: '开放 API' })).toHaveClass(
    /is-active/,
  )
  await expect(page.getByText('请求 curl')).toBeVisible()
  await expect(page.getByText('https://localhost:5000/openapi/chat')).toBeVisible()
  await expect(page.getByText('返回结果示例')).toBeVisible()

  await page.getByRole('button', { name: /Copy/ }).first().click()
  await expect(page.getByText('已复制')).toBeVisible()

  await page.getByRole('button', { name: '秘钥' }).click()
  await expect(page.getByRole('table', { name: '开放 API 秘钥' })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: '秘钥' })).toBeVisible()
  await expect(page.getByText('llmops-v1/k6FINx4S/7d52f03d').first()).toBeVisible()
  await expect(page.getByText('已禁用').first()).toBeVisible()
  await expect(page.getByText('可用').first()).toBeVisible()

  await page.getByRole('button', { name: '新增秘钥' }).click()
  await expect(page.getByRole('dialog', { name: '新增秘钥' })).toBeVisible()
  await page.getByPlaceholder('请输入秘钥备注，用于描述秘钥基础信息').fill('官网调试')
  await page
    .getByRole('dialog', { name: '新增秘钥' })
    .getByRole('button', { name: /保\s*存/ })
    .click()
  await expect(page.getByText('新增秘钥成功')).toBeVisible()
  await expect(page.getByText('llmops-v1/new-key/8c4f2a9e')).toBeVisible()

  const firstKeyRow = page.getByRole('row').filter({ hasText: 'llmops-v1/new-key/8c4f2a9e' })
  await expect(firstKeyRow.getByText('官网调试')).toBeVisible()
  await firstKeyRow.locator('.ant-switch').click()
  await expect(firstKeyRow.getByText('已禁用')).toBeVisible()

  await firstKeyRow.getByRole('button', { name: '更多操作' }).click()
  await page.getByRole('menuitem', { name: '编辑' }).click()
  await expect(page.getByRole('dialog', { name: '编辑秘钥' })).toBeVisible()
  await page.getByPlaceholder('请输入秘钥备注，用于描述秘钥基础信息').fill('微信公众号')
  await page.getByRole('dialog', { name: '编辑秘钥' }).locator('.ant-switch').click()
  await page
    .getByRole('dialog', { name: '编辑秘钥' })
    .getByRole('button', { name: /保\s*存/ })
    .click()
  await expect(page.getByText('保存成功')).toBeVisible()
  await expect(firstKeyRow.getByText('微信公众号')).toBeVisible()
  await expect(firstKeyRow.getByText('可用')).toBeVisible()

  await firstKeyRow.getByRole('button', { name: '更多操作' }).click()
  await page.getByRole('menuitem', { name: '删除' }).click()
  await expect(page.getByRole('dialog', { name: '删除该秘钥？' })).toBeVisible()
  await page
    .getByRole('dialog', { name: '删除该秘钥？' })
    .getByRole('button', { name: /删\s*除/ })
    .click()
  await expect(page.getByText('删除成功')).toBeVisible()
  await expect(page.getByText('llmops-v1/new-key/8c4f2a9e')).toHaveCount(0)
})
