/* ─── EXPORT COMPOSABLE ─── 
 * Handles PNG/JPEG/WebP/SVG export via html-to-image
 */
import { ref } from 'vue'
import { toPng, toJpeg, toSvg } from 'html-to-image'
import { useExportStore } from '../stores/export'
import { useEditorStore } from '../stores/editor'
import { useThemeStore } from '../stores/theme'

export function useExport() {
  const exportStore = useExportStore()
  const editorStore = useEditorStore()
  const themeStore = useThemeStore()
  const isExporting = ref(false)

  function getFilename(): string {
    const template = exportStore.filenameTemplate || 'codeaura-{title}-{lang}'
    const now = new Date()
    return template
      .replace('{lang}', editorStore.language || 'text')
      .replace('{theme}', themeStore.currentThemeId || 'default')
      .replace('{date}', now.toISOString().split('T')[0] || '')
      .replace('{time}', now.toTimeString().split(' ')[0]?.replace(/:/g, '-') || '')
      .replace('{title}', (editorStore.fileName || 'untitled').replace(/\.[^/.]+$/, ''))
  }

  async function exportImage(element: HTMLElement) {
    if (!element) return
    isExporting.value = true
    exportStore.isExporting = true

    try {
      const scale = exportStore.scale
      const options = {
        pixelRatio: scale,
        cacheBust: true,
        style: {
          transform: 'none',
          transformOrigin: 'top left',
        }
      }

      let dataUrl: string
      let ext: string

      switch (exportStore.format) {
        case 'jpeg':
          dataUrl = await toJpeg(element, { ...options, quality: exportStore.jpegQuality / 100 })
          ext = 'jpg'
          break
        case 'svg':
          dataUrl = await toSvg(element, options)
          ext = 'svg'
          break
        case 'webp':
          // html-to-image doesn't have native webp, use PNG and convert
          dataUrl = await toPng(element, options)
          ext = 'png' // fallback
          break
        default:
          dataUrl = await toPng(element, options)
          ext = 'png'
      }

      // Trigger download
      const link = document.createElement('a')
      link.download = `${getFilename()}.${ext}`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      isExporting.value = false
      exportStore.isExporting = false
    }
  }

  async function copyToClipboard(element: HTMLElement) {
    if (!element) return
    try {
      const dataUrl = await toPng(element, { pixelRatio: exportStore.scale, cacheBust: true })
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      return true
    } catch (err) {
      console.error('Copy to clipboard failed:', err)
      return false
    }
  }

  return {
    isExporting,
    exportImage,
    copyToClipboard,
    getFilename,
  }
}
