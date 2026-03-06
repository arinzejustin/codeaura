<script setup lang="ts">
/**
 * ExportPanel — Export format, scale, and download controls.
 */
import { ref } from 'vue'
import { useExportStore, type ExportFormat } from '../../../stores/export'
import { Download } from 'lucide-vue-next'
import Accordion from '../../ui/Accordion.vue'
import Slider from '../../ui/Slider.vue'
import Toggle from '../../ui/Toggle.vue'

const exportStore = useExportStore()
const copySuccess = ref(false)

const formats: { id: ExportFormat; label: string }[] = [
    { id: 'png', label: 'PNG' },
    { id: 'jpeg', label: 'JPEG' },
    { id: 'svg', label: 'SVG' },
    { id: 'webp', label: 'WebP' },
]

const scales = [1, 2, 3, 4]

const emit = defineEmits<{
    'export': []
    'copy': []
}>()

async function handleCopy() {
    emit('copy')
    copySuccess.value = true
    setTimeout(() => copySuccess.value = false, 2000)
}
</script>

<template>
    <Accordion title="Export" :icon="Download">
        <div class="space-y-4">
            <!-- Format -->
            <div class="space-y-1.5">
                <label class="text-xs font-body" style="color: var(--text-secondary)">Format</label>
                <div class="flex gap-1">
                    <button v-for="f in formats" :key="f.id" @click="exportStore.setFormat(f.id)"
                        class="flex-1 px-3 py-1.5 rounded-md text-xs font-body font-medium transition-all duration-150"
                        :style="{
                            background: exportStore.format === f.id ? 'var(--accent)' : 'var(--surface-2)',
                            color: exportStore.format === f.id ? 'var(--surface-0)' : 'var(--text-muted)',
                            border: exportStore.format === f.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                        }">
                        {{ f.label }}
                    </button>
                </div>
            </div>

            <!-- Scale -->
            <div class="space-y-1.5">
                <label class="text-xs font-body" style="color: var(--text-secondary)">Scale</label>
                <div class="flex gap-1">
                    <button v-for="s in scales" :key="s" @click="exportStore.setScale(s)"
                        class="flex-1 px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-150" :style="{
                            background: exportStore.scale === s ? 'var(--accent)' : 'var(--surface-2)',
                            color: exportStore.scale === s ? 'var(--surface-0)' : 'var(--text-muted)',
                            border: exportStore.scale === s ? '1px solid var(--accent)' : '1px solid var(--border)',
                        }">
                        {{ s }}x
                    </button>
                </div>
            </div>

            <!-- JPEG Quality -->
            <Slider v-if="exportStore.format === 'jpeg'" v-model="exportStore.jpegQuality" :min="60" :max="100"
                :step="5" label="Quality" suffix="%" />

            <!-- Transparent BG -->
            <Toggle v-if="exportStore.format === 'png' || exportStore.format === 'webp'"
                v-model="exportStore.transparentBg" label="Transparent Background" />

            <!-- Action Buttons -->
            <div class="space-y-2 pt-2">
                <button @click="emit('export')" class="btn-accent w-full flex items-center justify-center gap-2 py-2.5">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Image
                </button>
                <button @click="handleCopy" class="btn-surface w-full flex items-center justify-center gap-2">
                    <svg v-if="!copySuccess" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <svg v-else class="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ copySuccess ? 'Copied!' : 'Copy to Clipboard' }}
                </button>
            </div>
        </div>
    </Accordion>
</template>
