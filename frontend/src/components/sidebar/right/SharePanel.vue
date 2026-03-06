<script setup lang="ts">
/**
 * SharePanel — Share config via URL, create shareable snapshot, copy JSON, import config.
 */
import { ref, computed } from 'vue'
import { useEditorStore } from '../../../stores/editor'
import { useThemeStore } from '../../../stores/theme'
import { useFrameStore } from '../../../stores/frame'
import { useBackgroundStore } from '../../../stores/background'
import { useAuthStore } from '../../../stores/auth'
import { Share2, Copy, Upload, Link, Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const editor = useEditorStore()
const theme = useThemeStore()
const frame = useFrameStore()
const bg = useBackgroundStore()
const auth = useAuthStore()

const API_URL = import.meta.env.VITE_API_URL || '/api'

const copied = ref(false)
const jsonCopied = ref(false)
const importText = ref('')
const importStatus = ref<'idle' | 'success' | 'error'>('idle')
const isSharing = ref(false)
const shareUrl = ref('')
const shareCopied = ref(false)

/** Full snapshot config */
function getSnapshotConfig() {
  return {
    themeId: theme.currentThemeId,
    fontId: frame.fontId,
    fontSize: frame.fontSize,
    lineHeight: frame.lineHeight,
    padding: frame.padding,
    innerPadding: frame.innerPadding,
    borderRadius: frame.borderRadius,
    width: frame.width,
    windowStyle: frame.windowStyle,
    showLineNumbers: frame.showLineNumbers,
    shadow: frame.shadow,
    bgType: bg.bgType,
    bgColor: bg.solidColor,
    bgGradient: bg.gradientCss,
    showTitle: frame.showTitle,
    windowTitle: frame.windowTitle,
  }
}

/** Config JSON for copying */
const configJson = computed(() => {
  return JSON.stringify({
    language: editor.language,
    ...getSnapshotConfig(),
  }, null, 2)
})

/** Create a shareable snapshot via API */
async function createSnapshot() {
  isSharing.value = true
  shareUrl.value = ''

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (auth.accessToken) {
      headers['Authorization'] = `Bearer ${auth.accessToken}`
    }

    const response = await fetch(`${API_URL}/snapshots`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        code: editor.code,
        language: editor.language,
        config: getSnapshotConfig(),
      }),
    })

    if (response.ok) {
      const data = await response.json()
      shareUrl.value = data.shareUrl
      toast.success('Snapshot shared successfully!')
      // Auto-copy to clipboard
      try {
        await navigator.clipboard.writeText(data.shareUrl)
        shareCopied.value = true
        setTimeout(() => shareCopied.value = false, 3000)
      } catch { }
    } else {
      toast.error('Failed to create shareable snapshot')
    }
  } catch (e) {
    console.error('Share failed:', e)
    toast.error('Share failed Check network')
  } finally {
    isSharing.value = false
  }
}

async function copyShareUrl() {
  if (!shareUrl.value) return
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    shareCopied.value = true
    toast.success('Copied URL to clipboard!')
    setTimeout(() => shareCopied.value = false, 2000)
  } catch {
    toast.error('Failed to copy URL')
  }
}

async function copyJson() {
  try {
    await navigator.clipboard.writeText(configJson.value)
    jsonCopied.value = true
    toast.success('Config JSON copied!')
    setTimeout(() => jsonCopied.value = false, 2000)
  } catch {
    toast.error('Failed to copy Config JSON')
  }
}

function importConfig() {
  if (!importText.value.trim()) return

  try {
    const config = JSON.parse(importText.value.trim())

    if (config.language) editor.setLanguage(config.language)
    if (config.themeId || config.theme) theme.setTheme(config.themeId || config.theme)
    if (config.fontId || config.font) frame.fontId = config.fontId || config.font
    if (config.fontSize !== undefined) frame.fontSize = config.fontSize
    if (config.lineHeight !== undefined) frame.lineHeight = config.lineHeight
    if (config.bgType) bg.setBgType(config.bgType)
    if (config.bgColor) bg.setSolidColor(config.bgColor)
    if (config.bgGradient) bg.setGradient(config.bgGradient)
    if (config.windowStyle) frame.setWindowStyle(config.windowStyle)
    if (config.showLineNumbers !== undefined) frame.showLineNumbers = config.showLineNumbers
    if (config.padding !== undefined) frame.padding = config.padding
    if (config.borderRadius !== undefined) frame.borderRadius = config.borderRadius
    if (config.shadow) frame.shadowPreset = config.shadow
    if (config.width !== undefined) frame.width = config.width

    importStatus.value = 'success'
    importText.value = ''
    setTimeout(() => importStatus.value = 'idle', 2000)
  } catch (e) {
    importStatus.value = 'error'
    setTimeout(() => importStatus.value = 'idle', 2500)
  }
}
</script>

<template>
  <div class="space-y-3">
    <h3 class="section-header px-1">Share</h3>

    <!-- Share Snapshot (API) -->
    <div class="space-y-2">
      <button @click="createSnapshot" class="btn-accent w-full flex items-center justify-center gap-2 py-2"
        :class="{ 'opacity-60 pointer-events-none': isSharing }">
        <Loader2 v-if="isSharing" class="w-3.5 h-3.5 animate-spin" />
        <Share2 v-else class="w-3.5 h-3.5" />
        {{ isSharing ? 'Creating...' : 'Share Snapshot' }}
      </button>

      <!-- Share URL result -->
      <div v-if="shareUrl" class="space-y-1.5">
        <div class="flex gap-1.5">
          <input :value="shareUrl" readonly class="input-field flex-1 text-[10px] font-mono truncate" />
          <button @click="copyShareUrl" class="btn-surface flex-shrink-0 px-2">
            <span v-if="!shareCopied" class="text-xs">
              <Copy class="w-3 h-3" />
            </span>
            <span v-else class="text-xs text-green-400">✓</span>
          </button>
        </div>
        <p class="text-[9px] font-body" style="color: var(--text-subtle)">
          Anyone with this link can view your code snapshot
        </p>
      </div>
    </div>

    <!-- Divider -->
    <div class="w-full h-px" style="background: var(--border)" />

    <!-- Copy Config JSON -->
    <button @click="copyJson" class="btn-surface w-full flex items-center justify-center gap-2">
      <Copy class="w-3.5 h-3.5" />
      {{ jsonCopied ? 'Copied!' : 'Copy Config JSON' }}
    </button>

    <!-- Import config -->
    <div class="space-y-1.5 pt-1">
      <label class="text-[10px] font-body" style="color: var(--text-subtle)">Import Config</label>
      <textarea v-model="importText" class="input-field text-[10px] font-mono" placeholder='Paste JSON config here...'
        rows="3" />
      <button @click="importConfig" class="btn-surface w-full text-xs flex items-center justify-center gap-1.5" :class="{
        '!border-green-500/50 !text-green-400': importStatus === 'success',
        '!border-red-500/50 !text-red-400': importStatus === 'error',
      }">
        <Upload v-if="importStatus === 'idle'" class="w-3.5 h-3.5" />
        {{ importStatus === 'success' ? '✓ Config Applied!' : importStatus === 'error' ? '✕ Invalid JSON' : 'Import Config' }}
      </button>
    </div>
  </div>
</template>
