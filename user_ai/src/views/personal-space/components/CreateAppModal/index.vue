<script setup lang="ts">
import AppIcon from '@/components/AppIcon/index.vue'
import type { AppFormMode, AppItem, CreateAppPayload } from '@/views/personal-space/share/app'
import type { FormInstance, UploadEmits, UploadProps } from 'antdv-next'
import { Form, FormItem, Input, message, Modal, TextArea, Upload } from 'antdv-next'
import { computed, reactive, ref, shallowRef, watch } from 'vue'

type FileType = Parameters<NonNullable<UploadProps['beforeUpload']>>[0]

const open = defineModel<boolean>('open', { required: true })
const props = withDefaults(
  defineProps<{
    mode?: AppFormMode
    initialValue?: AppItem | null
  }>(),
  {
    mode: 'create',
    initialValue: null,
  },
)
const emit = defineEmits<{
  submit: [payload: CreateAppPayload]
}>()

const formRef = shallowRef<FormInstance>()
const iconLoading = ref(false)
const formModel = reactive<CreateAppPayload>({
  icon: '',
  name: '',
  description: '',
})
const modalTitle = computed(() => (props.mode === 'edit' ? '编辑 AI 应用' : '创建 AI 应用'))
const hasImageIcon = computed(() =>
  /^(blob:|data:image\/|https?:\/\/)/.test(formModel.icon),
)

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

function syncFormModel(value?: AppItem | null) {
  formModel.icon = value?.icon ?? ''
  formModel.name = value?.name ?? ''
  formModel.description = value?.description ?? ''
  iconLoading.value = false
  formRef.value?.clearValidate()
}

function getImagePreview(file: FileType) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

const beforeIconUpload: UploadProps['beforeUpload'] = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'

  if (!isJpgOrPng) {
    message.error('请上传 JPG/PNG 格式的图标')
  }

  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isLt2M) {
    message.error('图标大小不能超过 2MB')
  }

  return isJpgOrPng && isLt2M
}

const requestIconUpload: UploadProps['customRequest'] = ({ onSuccess }) => {
  onSuccess?.({})
}

const handleIconChange: UploadEmits['change'] = async (info) => {
  if (info.file?.status === 'uploading') {
    iconLoading.value = true
    return
  }

  if (info.file?.status === 'done') {
    try {
      if (info.file.originFileObj) {
        formModel.icon = await getImagePreview(info.file.originFileObj as FileType)
        formRef.value?.clearValidate(['icon'])
      }
    }
    finally {
      iconLoading.value = false
    }
    return
  }

  iconLoading.value = false
}

function submitForm() {
  formRef.value?.submit()
}

function handleSubmit() {
  emit('submit', {
    icon: formModel.icon,
    name: formModel.name.trim(),
    description: formModel.description.trim(),
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
            <AppIcon :icon="iconLoading ? 'lucide:loader-circle' : formModel.icon || 'lucide:plus'" size="20" />
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
