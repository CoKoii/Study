export function formatCount(count: number, unit: string) {
  return `${count.toLocaleString('zh-CN')} ${unit}`
}
