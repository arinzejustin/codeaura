<script setup lang="ts">
/**
 * PresetsPanel — Curated full-config presets with one-click apply.
 */
import { defaultPresets, type Preset } from '../../../data/presets'
import { useThemeStore } from '../../../stores/theme'
import { useFrameStore } from '../../../stores/frame'
import { useBackgroundStore } from '../../../stores/background'
import { getThemeById } from '../../../data/themes'

const themeStore = useThemeStore()
const frame = useFrameStore()
const bg = useBackgroundStore()

function applyPreset(preset: Preset) {
  const c = preset.config
  themeStore.setTheme(c.themeId)
  frame.fontId = c.fontId
  frame.fontSize = c.fontSize
  frame.lineHeight = c.lineHeight
  frame.showLineNumbers = c.showLineNumbers
  frame.padding = c.padding
  frame.innerPadding = c.innerPadding
  frame.borderRadius = c.borderRadius
  frame.shadow = c.shadow
  frame.width = c.width
  
  bg.setBgType(c.bgType)
  if (c.bgType === 'solid') bg.setSolidColor(c.bgColor)
  if (c.bgType === 'gradient') bg.setGradient(c.bgGradient)
}

function getPresetColors(preset: Preset) {
  const theme = getThemeById(preset.config.themeId)
  return theme ? [theme.colors.background, theme.colors.keyword, theme.colors.string, theme.colors.function] : []
}
</script>

<template>
  <div class="space-y-2">
    <h3 class="section-header px-1">Presets</h3>
    <div class="space-y-1">
      <button
        v-for="preset in defaultPresets"
        :key="preset.id"
        @click="applyPreset(preset)"
        class="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group"
        style="border: 1px solid transparent"
        @mouseenter="($event.target as HTMLElement).style.background = 'var(--surface-2)'"
        @mouseleave="($event.target as HTMLElement).style.background = 'transparent'"
      >
        <!-- Color preview -->
        <div 
          class="w-8 h-8 rounded-md flex-shrink-0 overflow-hidden flex flex-wrap"
          :style="{ border: '1px solid var(--border-strong)' }"
        >
          <span 
            v-for="(color, i) in getPresetColors(preset)" :key="i"
            class="w-4 h-4"
            :style="{ background: color }"
          />
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-body font-medium" style="color: var(--text-primary)">
            {{ preset.name }}
          </div>
          <div class="text-[10px] font-body truncate" style="color: var(--text-muted)">
            {{ preset.description }}
          </div>
        </div>
      </button>
    </div>
  </div>
</template>
