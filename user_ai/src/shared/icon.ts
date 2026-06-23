export function isImageIcon(icon?: string) {
  return /^(blob:|data:image\/|https?:\/\/)/.test(icon ?? '')
}
