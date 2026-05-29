<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import { useAppIconUpload } from '@/views/personal-space/components/CreateAppModal/share/use-app-icon-upload'
import type { SpaceApp, SpaceAppForm } from '@/stores/app-list'
import type { FormInstance } from 'antdv-next'
import { Form, FormItem, Input, Modal, TextArea, Upload } from 'antdv-next'
import { computed, reactive, ref, shallowRef, toRef, watch } from 'vue'

const open = defineModel<boolean>('open', { required: true })
const props = withDefaults(
  defineProps<{
    mode?: 'create' | 'edit'
    initialValue?: SpaceApp | null
  }>(),
  {
    mode: 'create',
    initialValue: null,
  },
)
const emit = defineEmits<{
  submit: [form: SpaceAppForm]
}>()

const formRef = shallowRef<FormInstance>()
const iconLoading = ref(false)
const formModel = reactive<SpaceAppForm>({
  icon: '',
  name: '',
  description: '',
})
const modalTitle = computed(() => (props.mode === 'edit' ? '编辑 AI 应用' : '创建 AI 应用'))
const hasImageIcon = computed(() => /^(blob:|data:image\/|https?:\/\/)/.test(formModel.icon))

function resetForm() {
  formModel.icon = ''
  formModel.name = ''
  formModel.description = ''
  iconLoading.value = false
  formRef.value?.clearValidate()
}

function closeModal() {
  open.value = false
  resetForm()
}

function syncFormModel(value?: SpaceApp | null) {
  formModel.icon = value?.icon ?? ''
  formModel.name = value?.name ?? ''
  formModel.description = value?.description ?? ''
  iconLoading.value = false
  formRef.value?.clearValidate()
}

const { beforeIconUpload, handleIconChange, requestIconUpload } = useAppIconUpload(
  toRef(formModel, 'icon'),
  iconLoading,
  formRef,
)

function submitForm() {
  formRef.value?.submit()
}

function handleSubmit() {
  emit('submit', {
    icon: formModel.icon,
    name: formModel.name,
    description: formModel.description,
  })
  closeModal()
}

watch(open, (isOpen) => {
  if (isOpen) {
    syncFormModel(props.initialValue)
  }
})
</script>

<template>
  <Modal
    v-model:open="open"
    :title="modalTitle"
    width="494px"
    centered
    :mask="{ blur: false, closable: true }"
    cancel-text="取消"
    ok-text="保存"
    @cancel="closeModal"
    @ok="submitForm"
  >
    <Form
      ref="formRef"
      layout="vertical"
      name="create_app"
      :model="formModel"
      clear-on-destroy
      @finish="handleSubmit"
    >
      <FormItem
        label="应用图标"
        name="icon"
        :rules="[{ required: true, message: '请上传应用图标' }]"
      >
        <Upload
          name="avatar"
          accept="image/jpeg,image/png"
          list-type="picture-card"
          :show-upload-list="false"
          action="/api/upload"
          :before-upload="beforeIconUpload"
          :custom-request="requestIconUpload"
          @change="handleIconChange"
        >
          <img
            v-if="hasImageIcon"
            :src="formModel.icon"
            alt="avatar"
            :draggable="false"
            class="create-app-modal__icon-preview"
          />
          <button v-else class="create-app-modal__upload-trigger" type="button">
            <AppIcon
              :icon="iconLoading ? 'lucide:loader-circle' : formModel.icon || 'lucide:plus'"
              size="20"
            />
            <div>上传图标</div>
          </button>
        </Upload>
      </FormItem>

      <FormItem
        label="应用名称"
        name="name"
        :rules="[{ required: true, whitespace: true, message: '应用名称不能为空' }]"
      >
        <Input
          v-model:value="formModel.name"
          placeholder="应用名称不能为空"
          :maxlength="40"
          :show-count="true"
        />
      </FormItem>

      <FormItem label="应用描述" name="description">
        <TextArea
          v-model:value="formModel.description"
          placeholder="请输入关于该应用的描述信息"
          :maxlength="800"
          :show-count="true"
          :auto-size="{ minRows: 2, maxRows: 4 }"
        />
      </FormItem>
    </Form>
  </Modal>
</template>

<style scoped lang="scss">
@use './index.scss';
</style>
