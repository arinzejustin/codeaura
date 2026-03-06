<script setup lang="ts">
/**
 * FontPanel — Font family selector with live mini-preview, 
 * size, line height, weight, and ligature controls.
 */
import { onMounted } from 'vue'
import { useFrameStore } from '../../../stores/frame'
import { fonts, loadFont } from '../../../data/fonts'
import { Type } from 'lucide-vue-next'
import Accordion from '../../ui/Accordion.vue'
import Slider from '../../ui/Slider.vue'
import Toggle from '../../ui/Toggle.vue'

const frame = useFrameStore()

const weightOptions = [
    { value: 300, label: 'Light' },
    { value: 400, label: 'Regular' },
    { value: 500, label: 'Medium' },
    { value: 700, label: 'Bold' },
]

async function selectFont(fontId: string) {
    const font = fonts.find(f => f.id === fontId)
    if (font) {
        await loadFont(font)
        frame.fontId = fontId
    }
}

// Preload the default font
onMounted(async () => {
    const defaultFont = fonts.find(f => f.id === frame.fontId)
    if (defaultFont) await loadFont(defaultFont)
})
</script>

<template>
    <Accordion title="Fonts" :icon="Type">
        <div class="space-y-4">
            <!-- Font Family Grid -->
            <div class="space-y-1.5">
                <label class="text-xs font-body" style="color: var(--text-secondary)">Font Family</label>
                <div class="space-y-1 max-h-64 overflow-y-auto pr-1">
                    <button v-for="font in fonts" :key="font.id" @click="selectFont(font.id)"
                        class="w-full flex flex-col gap-0.5 px-3 py-2 rounded-lg text-left transition-all duration-200"
                        :style="{
                            background: frame.fontId === font.id ? 'var(--surface-3)' : 'transparent',
                            border: frame.fontId === font.id
                                ? '1px solid var(--accent)'
                                : '1px solid transparent',
                        }">
                        <span class="text-[10px] font-body" style="color: var(--text-muted)">
                            {{ font.name }}
                            <span v-if="font.hasLigatures" class="ml-1 opacity-50">lig</span>
                        </span>
                        <span class="text-xs" :style="{ fontFamily: font.family, color: 'var(--text-secondary)' }">
                            const x = () =&gt; 0;
                        </span>
                    </button>
                </div>
            </div>

            <!-- Font Size -->
            <Slider v-model="frame.fontSize" :min="10" :max="24" :step="1" label="Font Size" suffix="px" />

            <!-- Line Height -->
            <Slider v-model="frame.lineHeight" :min="1.0" :max="2.5" :step="0.1" label="Line Height" />

            <!-- Letter Spacing -->
            <Slider v-model="frame.letterSpacing" :min="-2" :max="4" :step="0.5" label="Letter Spacing" suffix="px" />

            <!-- Font Weight -->
            <div class="space-y-1.5">
                <label class="text-xs font-body" style="color: var(--text-secondary)">Weight</label>
                <div class="flex gap-1">
                    <button v-for="w in weightOptions" :key="w.value" @click="frame.fontWeight = w.value"
                        class="flex-1 px-2 py-1 rounded-md text-[10px] font-body transition-all duration-150" :style="{
                            background: frame.fontWeight === w.value ? 'var(--surface-3)' : 'transparent',
                            color: frame.fontWeight === w.value ? 'var(--text-primary)' : 'var(--text-muted)',
                            border: frame.fontWeight === w.value ? '1px solid var(--accent)' : '1px solid var(--border)',
                        }">
                        {{ w.label }}
                    </button>
                </div>
            </div>

            <!-- Ligatures -->
            <Toggle v-model="frame.ligatures" label="Ligatures" />
        </div>
    </Accordion>
</template>
