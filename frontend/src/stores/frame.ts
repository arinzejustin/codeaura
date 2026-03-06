/* ─── FRAME STORE ─── 
 * Window chrome, padding, sizing, border radius, shadow.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type WindowStyle = 'macos-dark' | 'macos-light' | 'windows-11' | 'terminal' | 'minimal' | 'none'
export type TrafficLightStyle = 'colored' | 'monochrome' | 'outlined' | 'hidden'

export const useFrameStore = defineStore('frame', () => {
  // ── Window Chrome ──
  const windowStyle = ref<WindowStyle>('macos-dark')
  const windowTitle = ref('untitled')
  const showTitle = ref(true)
  const titleAlignment = ref<'left' | 'center'>('center')
  const trafficLightStyle = ref<TrafficLightStyle>('colored')

  // ── Sizing ──
  const padding = ref(48)
  const innerPadding = ref(20)
  const borderRadius = ref(12)
  const width = ref(720)
  const autoHeight = ref(true)
  const height = ref(400)

  // ── Border ──
  const borderWidth = ref(0)
  const borderColor = ref('rgba(255,255,255,0.1)')

  // ── Shadow ──
  const shadow = ref('0 20px 60px rgba(0,0,0,0.5)')
  const shadowPreset = ref('dramatic')

  // ── Line Numbers ──
  const showLineNumbers = ref(true)
  const lineNumberStart = ref(1)
  const highlightedLines = ref('')
  const focusDimOpacity = ref(40)

  // ── Font ──
  const fontId = ref('fira-code')
  const fontSize = ref(14)
  const lineHeight = ref(1.7)
  const letterSpacing = ref(0)
  const fontWeight = ref(400)
  const ligatures = ref(true)

  // ── Actions ──
  function setWindowStyle(style: WindowStyle) {
    windowStyle.value = style
  }

  function setShadow(preset: string, css: string) {
    shadowPreset.value = preset
    shadow.value = css
  }

  function resetToDefaults() {
    windowStyle.value = 'macos-dark'
    padding.value = 48
    innerPadding.value = 20
    borderRadius.value = 12
    width.value = 720
    shadow.value = '0 20px 60px rgba(0,0,0,0.5)'
    fontId.value = 'fira-code'
    fontSize.value = 14
    lineHeight.value = 1.7
    showLineNumbers.value = true
  }

  return {
    windowStyle,
    windowTitle,
    showTitle,
    titleAlignment,
    trafficLightStyle,
    padding,
    innerPadding,
    borderRadius,
    width,
    autoHeight,
    height,
    borderWidth,
    borderColor,
    shadow,
    shadowPreset,
    showLineNumbers,
    lineNumberStart,
    highlightedLines,
    focusDimOpacity,
    fontId,
    fontSize,
    lineHeight,
    letterSpacing,
    fontWeight,
    ligatures,
    setWindowStyle,
    setShadow,
    resetToDefaults,
  }
})
