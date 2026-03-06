/* ─── BACKGROUND STORE ─── */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type BgType = 'solid' | 'gradient' | 'none'

export const useBackgroundStore = defineStore('background', () => {
  const bgType = ref<BgType>('gradient')
  const solidColor = ref('#1a1b26')
  const solidOpacity = ref(1)
  const gradientCss = ref('linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)')
  const gradientAngle = ref(135)
  const animateGradient = ref(false)

  const backgroundStyle = computed(() => {
    switch (bgType.value) {
      case 'solid':
        return { background: solidColor.value, opacity: solidOpacity.value }
      case 'gradient':
        return { background: gradientCss.value }
      case 'none':
        return { background: 'transparent' }
      default:
        return { background: solidColor.value }
    }
  })

  function setBgType(type: BgType) {
    bgType.value = type
  }

  function setSolidColor(color: string) {
    solidColor.value = color
  }

  function setGradient(css: string) {
    gradientCss.value = css
  }

  return {
    bgType,
    solidColor,
    solidOpacity,
    gradientCss,
    gradientAngle,
    animateGradient,
    backgroundStyle,
    setBgType,
    setSolidColor,
    setGradient,
  }
})
