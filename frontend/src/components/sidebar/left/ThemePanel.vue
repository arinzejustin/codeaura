<script setup lang="ts">
/**
 * ThemePanel — Theme selection with categorized swatch grid.
 */
import { useThemeStore } from '../../../stores/theme'
import { getThemesByCategory } from '../../../data/themes'
import { Palette } from 'lucide-vue-next'
import Accordion from '../../ui/Accordion.vue'

const themeStore = useThemeStore()
const categories = getThemesByCategory()

const categoryLabels: Record<string, string> = {
  dark: 'Dark Themes',
  light: 'Light Themes',
  'high-contrast': 'High Contrast',
  retro: 'Retro / Special',
}

function selectTheme(id: string) {
  themeStore.setTheme(id)
}
</script>

<template>
  <Accordion title="Themes" :icon="Palette">
    <div class="space-y-4">
      <!-- Randomize Button -->
      <button @click="themeStore.randomizeTheme" class="btn-surface w-full flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Randomize Theme
      </button>

      <!-- Theme Categories -->
      <div v-for="(themesInCategory, category) in categories" :key="category" class="space-y-2">
        <h4 class="text-[10px] font-display font-semibold uppercase tracking-wider" style="color: var(--text-subtle)">
          {{ categoryLabels[category] }}
        </h4>
        <div class="grid grid-cols-2 gap-1.5">
          <button v-for="theme in themesInCategory" :key="theme.id" @click="selectTheme(theme.id)"
            class="group relative flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all duration-200"
            :style="{
              background: themeStore.currentThemeId === theme.id ? 'var(--surface-3)' : 'var(--surface-2)',
              border: themeStore.currentThemeId === theme.id
                ? '1px solid var(--accent)'
                : '1px solid transparent',
              boxShadow: themeStore.currentThemeId === theme.id
                ? '0 0 12px rgba(var(--accent-rgb), 0.15)'
                : 'none'
            }">
            <!-- Color dots preview -->
            <div class="flex gap-0.5 flex-shrink-0">
              <span class="w-2.5 h-2.5 rounded-full"
                :style="{ background: theme.colors.background, border: '1px solid rgba(255,255,255,0.1)' }" />
              <span class="w-2.5 h-2.5 rounded-full" :style="{ background: theme.colors.keyword }" />
              <span class="w-2.5 h-2.5 rounded-full" :style="{ background: theme.colors.string }" />
              <span class="w-2.5 h-2.5 rounded-full" :style="{ background: theme.colors.function }" />
              <span class="w-2.5 h-2.5 rounded-full" :style="{ background: theme.colors.comment }" />
            </div>
            <!-- Name -->
            <span class="text-[10px] font-body truncate" style="color: var(--text-secondary)">
              {{ theme.name }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </Accordion>
</template>
