export type SpaceResourceKind = 'app' | 'plugin' | 'workflow' | 'knowledge'

export const appResource = {
  kind: 'app',
  routeName: 'personal-space-apps',
  label: 'AI应用',
  title: '应用',
  createText: '创建AI应用',
  searchPlaceholder: '搜索应用',
  deleteWarning:
    '删除应用后，发布的WebApp、开放API以及关联的社交媒体平台均无法使用该Agent应用，如果需要暂停应用，可使用取消发布功能。',
  emptyText: '暂无 AI 应用',
  fallbackDescription: '暂无应用描述。',
  accent: '#2563eb',
  type: 'AI应用',
  modal: {
    name: 'AI 应用',
    iconLabel: '应用图标',
    nameLabel: '应用名称',
    descriptionLabel: '应用描述',
  },
} as const

const pluginResource = {
  kind: 'plugin',
  routeName: 'personal-space-plugins',
  label: '插件',
  title: '插件',
  createText: '创建插件',
  searchPlaceholder: '搜索插件',
  deleteWarning: '删除插件后，已关联该插件的应用和工作流将无法继续调用对应工具能力。',
  emptyText: '暂无插件',
  fallbackDescription: '暂无插件描述。',
  accent: '#0d9488',
  type: '自定义插件',
  modal: {
    name: '插件',
    iconLabel: '插件图标',
    nameLabel: '插件名称',
    descriptionLabel: '插件描述',
  },
} as const

const workflowResource = {
  kind: 'workflow',
  routeName: 'personal-space-workflows',
  label: '工作流',
  title: '工作流',
  createText: '创建工作流',
  searchPlaceholder: '搜索工作流',
  deleteWarning: '删除工作流后，已关联该工作流的应用将无法继续执行对应编排。',
  emptyText: '暂无工作流',
  fallbackDescription: '暂无工作流描述。',
  accent: '#7c3aed',
  type: '工作流',
  modal: {
    name: '工作流',
    iconLabel: '工作流图标',
    nameLabel: '工作流名称',
    descriptionLabel: '工作流描述',
  },
} as const

const knowledgeResource = {
  kind: 'knowledge',
  routeName: 'personal-space-knowledge',
  label: '知识库',
  title: '知识库',
  createText: '创建知识库',
  searchPlaceholder: '搜索知识库',
  deleteWarning: '删除知识库后，已关联该知识库的应用将无法继续检索其中的文档内容。',
  emptyText: '暂无知识库',
  fallbackDescription: '暂无知识库描述。',
  accent: '#16a34a',
  type: '知识库',
  modal: {
    name: '知识库',
    iconLabel: '知识库图标',
    nameLabel: '知识库名称',
    descriptionLabel: '知识库描述',
  },
} as const

export const spaceResources = [appResource, pluginResource, workflowResource, knowledgeResource]

export function getSpaceResourceByKind(kind: SpaceResourceKind) {
  return spaceResources.find((resource) => resource.kind === kind) ?? appResource
}

export function getSpaceResourceByRouteName(routeName: unknown) {
  return spaceResources.find((resource) => resource.routeName === routeName) ?? appResource
}
