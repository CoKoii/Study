<script setup lang="ts">
defineOptions({ name: 'App' })

/** ---------- 工具函数 ---------- */
const root = document.documentElement as HTMLElement

const getTheme = (): 'light' | 'dark' =>
  (root.getAttribute('data-theme') as 'light' | 'dark') || 'light'

const setTheme = (next: 'light' | 'dark') => {
  root.setAttribute('data-theme', next)
  // 如果你有 color-scheme 适配，可以同步：
  // root.style.colorScheme = next
}

const getClickPoint = (e?: MouseEvent | PointerEvent) => {
  // 事件可能来自键盘触发或不可用坐标的场景，回退到屏幕中心
  const x = e?.clientX ?? window.innerWidth / 2
  const y = e?.clientY ?? window.innerHeight / 2
  return { x, y }
}

const getEndRadius = (x: number, y: number) =>
  Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

/** ---------- 动画封装 & 重入保护 ---------- */
let animating = false

const toggleTheme = (e?: MouseEvent | PointerEvent) => {
  if (animating) return
  const current = getTheme()
  const next: 'light' | 'dark' = current === 'dark' ? 'light' : 'dark'

  // 兼容：不支持 View Transition 时，直接切换
  // @ts-ignore
  if (!document.startViewTransition) {
    setTheme(next)
    return
  }

  animating = true
  const { x, y } = getClickPoint(e)
  const endRadius = getEndRadius(x, y)

  // @ts-ignore
  const transition = document.startViewTransition(() => setTheme(next))

  transition.ready
    .then(() => {
      // 等快照就绪，再开启动画（下一帧确保样式切换已生效）
      requestAnimationFrame(() => {
        root
          .animate(
            {
              clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
            },
            {
              duration: 480,
              easing: 'ease-in-out',
              // 关键：作用于“新态快照”伪元素
              pseudoElement: '::view-transition-new(root)',
            },
          )
          .finished.finally(() => {
            animating = false
          })
      })
    })
    .catch(() => {
      animating = false
    })
}

/** ---------- 事件处理：统一用 pointerdown 更稳 ---------- */
const onPointerDown = (e: PointerEvent) => toggleTheme(e)
</script>

<template>
  <div class="App">
    <!-- 语义更推荐 button；如坚持用 a，也建议加 role/button 属性 -->
    <button class="theme-toggle" type="button" @pointerdown="onPointerDown" aria-label="切换主题">
      日/夜
    </button>
  </div>
</template>

<!-- 全局样式（不加 scoped）：关闭默认的视图过渡动画，避免与自定义动画冲突 -->
<style lang="scss">
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
</style>

<!-- 组件局部样式 -->
<style scoped lang="scss">
.App {
  width: 100vw;
  height: 100vh;
  background-color: var(--background-color-1);

  .theme-toggle {
    position: absolute;
    right: 0;
    width: 120px;
    height: 50px;
    font-size: 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.2s ease;
    color: var(--text-color-1);
    background-color: transparent;
    border: 1px solid currentColor;

    &:active {
      transform: scale(0.96);
    }
  }
}
</style>
