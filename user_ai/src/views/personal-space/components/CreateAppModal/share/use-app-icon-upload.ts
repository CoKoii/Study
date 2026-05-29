import type { FormInstance, UploadEmits, UploadProps } from 'antdv-next'
import { message } from 'antdv-next'
import type { Ref, ShallowRef } from 'vue'

type FileType = Parameters<NonNullable<UploadProps['beforeUpload']>>[0]

export function useAppIconUpload(
  icon: Ref<string>,
  iconLoading: Ref<boolean>,
  formRef: ShallowRef<FormInstance | undefined>,
) {
  const beforeIconUpload: UploadProps['beforeUpload'] = (file) => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isImage) {
      message.error('请上传 JPG/PNG 格式的图标')
    }

    if (!isLt2M) {
      message.error('图标大小不能超过 2MB')
    }

    return isImage && isLt2M
  }

  const requestIconUpload: UploadProps['customRequest'] = ({ onSuccess }) => {
    onSuccess?.({})
  }

  const handleIconChange: UploadEmits['change'] = async (info) => {
    if (info.file?.status === 'uploading') {
      iconLoading.value = true
      return
    }

    if (info.file?.status !== 'done') {
      iconLoading.value = false
      return
    }

    try {
      if (info.file.originFileObj) {
        icon.value = await readImageAsDataUrl(info.file.originFileObj as FileType)
        formRef.value?.clearValidate(['icon'])
      }
    } finally {
      iconLoading.value = false
    }
  }

  return {
    beforeIconUpload,
    handleIconChange,
    requestIconUpload,
  }
}

function readImageAsDataUrl(file: FileType) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}
