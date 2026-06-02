import type { FormInstance, UploadProps } from 'antdv-next'
import { message } from 'antdv-next'
import type { Ref, ShallowRef } from 'vue'

type FileType = Parameters<NonNullable<UploadProps['beforeUpload']>>[0]

export function useAppIconUpload(
  icon: Ref<string>,
  iconLoading: Ref<boolean>,
  formRef: ShallowRef<FormInstance | undefined>,
) {
  const beforeIconUpload: UploadProps['beforeUpload'] = async (file) => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isImage) {
      message.error('请上传 JPG/PNG 格式的图标')
    }

    if (!isLt2M) {
      message.error('图标大小不能超过 2MB')
    }

    if (!isImage || !isLt2M) {
      return false
    }

    try {
      iconLoading.value = true
      icon.value = await readImageAsDataUrl(file)
      formRef.value?.clearValidate(['icon'])
    } finally {
      iconLoading.value = false
    }

    return false
  }

  return {
    beforeIconUpload,
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
