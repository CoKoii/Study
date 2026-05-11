<script setup>
const props = defineProps({
  total: {
    type: Number,
    default: 0
  },
  pageNum: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['change'])

function prevPage() {
  if (props.pageNum > 1) {
    emit('change', props.pageNum - 1)
  }
}

function nextPage() {
  if (props.pageNum * props.pageSize < props.total) {
    emit('change', props.pageNum + 1)
  }
}
</script>

<template>
  <section class="panel pagination-bar">
    <span>共 {{ props.total }} 条记录，第 {{ props.pageNum }} 页</span>
    <div class="action-group">
      <button class="btn btn-sm" :disabled="props.pageNum <= 1" @click="prevPage">上一页</button>
      <button
        class="btn btn-sm"
        :disabled="props.pageNum * props.pageSize >= props.total"
        @click="nextPage"
      >
        下一页
      </button>
    </div>
  </section>
</template>
