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
  await expect(page.getByText('产品手册知识库')).toBeVisible()
})

test('opens create modal from the sidebar create action', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('complementary').getByRole('button', { name: '创建 AI 应用' }).click()

  await expect(page).toHaveURL(/\/personal-space\/apps$/)
  await expect(page.getByRole('dialog', { name: '创建 AI 应用' })).toBeVisible()
})
