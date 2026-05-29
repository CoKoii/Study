export interface NavItem {
  icon: string
  label: string
  to: string
}

export interface ExploreItem {
  icon: string
  label: string
}

export const navItems: NavItem[] = [
  { icon: 'lucide:house', label: '主页', to: '/' },
  { icon: 'lucide:user-round', label: '个人空间', to: '/personal-space' },
]

export const exploreItems: ExploreItem[] = [
  { icon: 'lucide:bot', label: '应用广场' },
  { icon: 'lucide:box', label: '插件广场' },
  { icon: 'lucide:link', label: '开放 API' },
]
