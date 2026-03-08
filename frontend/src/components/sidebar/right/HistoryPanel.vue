<script setup lang="ts">
/**
 * HistoryPanel — Auto-saved states with restore and pin functionality.
 */
import { useHistoryStore } from '../../../stores/history'
import { useEditorStore } from '../../../stores/editor'
import { useThemeStore } from '../../../stores/theme'
import { useBackgroundStore } from '../../../stores/background'
import { useFrameStore } from '../../../stores/frame'
import type { HistoryEntry } from '../../../stores/history'

const historyStore = useHistoryStore()
const editor = useEditorStore()
const theme = useThemeStore()
const bg = useBackgroundStore()
const frame = useFrameStore()

function restore(entry: HistoryEntry) {
  const c = entry.config
  if (!c) return
  if (c.theme) theme.setTheme(c.theme)
  if (c.code !== undefined) editor.setCode(c.code)
  if (c.language) editor.setLanguage(c.language)
  if (c.bg) Object.assign(bg.$state, c.bg)
  if (c.frame) Object.assign(frame.$state, c.frame)
}

function formatTime(ts: number) {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(ts: number) {
  const d = new Date(ts)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between px-1">
      <h3 class="section-header">History</h3>
      <button
        v-if="historyStore.entries.length > 0"
        @click="historyStore.clearHistory"
        class="text-[10px] font-body px-2 py-0.5 rounded hover:bg-white/5 transition-colors"
        style="color: var(--text-subtle)"
      >
        Clear
      </button>
    </div>

    <div v-if="historyStore.entries.length === 0" class="text-center py-8">
      <div class="text-2xl mb-2 opacity-30">📋</div>
      <p class="text-xs" style="color: var(--text-subtle)">No history yet</p>
      <p class="text-[10px] mt-1" style="color: var(--text-subtle)">Changes will auto-save here</p>
    </div>

    <div v-else class="space-y-0.5 max-h-80 overflow-y-auto">
      <div
        v-for="entry in historyStore.entries"
        :key="entry.id"
        class="group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-150"
        @click="restore(entry)"
        @mouseenter="($event.currentTarget as HTMLElement).style.background = 'var(--surface-2)'"
        @mouseleave="($event.currentTarget as HTMLElement).style.background = 'transparent'"
      >
        <!-- Pin indicator -->
        <button
          @click.stop="historyStore.togglePin(entry.id)"
          class="w-4 h-4 flex items-center justify-center flex-shrink-0 transition-opacity"
          :class="{ 'opacity-100': entry.pinned, 'opacity-0 group-hover:opacity-50': !entry.pinned }"
        >
          <span class="text-[10px]">{{ entry.pinned ? '📌' : '○' }}</span>
        </button>
        <div class="flex-1 min-w-0">
          <div class="text-[11px] font-mono truncate" style="color: var(--text-secondary)">
            {{ entry.codePreview }}
          </div>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-[9px] font-body" style="color: var(--text-subtle)">{{ entry.language }}</span>
            <span class="text-[9px]" style="color: var(--text-subtle)">·</span>
            <span class="text-[9px] font-body" style="color: var(--text-subtle)">{{ entry.themeId }}</span>
          </div>
        </div>
        <div class="text-right flex-shrink-0">
          <div class="text-[9px] font-mono" style="color: var(--text-subtle)">{{ formatTime(entry.timestamp) }}</div>
          <div class="text-[9px] font-body" style="color: var(--text-subtle)">{{ formatDate(entry.timestamp) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
