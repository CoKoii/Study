export interface MenuItem {
  icon: string
  label: string
  active?: boolean
}

export const navItems: MenuItem[] = [
  { icon: 'lucide:house', label: '主页', active: true },
  { icon: 'lucide:user-round', label: '个人空间' },
]

export const exploreItems: MenuItem[] = [
  { icon: 'lucide:bot', label: '应用广场' },
  { icon: 'lucide:box', label: '插件广场' },
  { icon: 'lucide:link', label: '开放 API' },
]
