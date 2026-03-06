/* ─── EXPORT STORE ─── */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ExportFormat = 'png' | 'jpeg' | 'svg' | 'webp'

export const useExportStore = defineStore('export', () => {
  const format = ref<ExportFormat>('png')
  const scale = ref(2)
  const jpegQuality = ref(90)
  const transparentBg = ref(false)
  const filenameTemplate = ref('codeaura-{lang}-{theme}')
  const isExporting = ref(false)

  function setFormat(f: ExportFormat) {
    format.value = f
  }

  function setScale(s: number) {
    scale.value = s
  }

  return {
    format,
    scale,
    jpegQuality,
    transparentBg,
    filenameTemplate,
    isExporting,
    setFormat,
    setScale,
  }
})
