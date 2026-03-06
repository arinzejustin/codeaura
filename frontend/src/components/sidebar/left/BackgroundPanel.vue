<script setup lang="ts">
/**
 * BackgroundPanel — Solid / Gradient / Transparent background controls.
 */
import { useBackgroundStore } from '../../../stores/background'
import { gradientPresets } from '../../../data/gradients'
import { Image } from 'lucide-vue-next'
import Accordion from '../../ui/Accordion.vue'
import Tabs from '../../ui/Tabs.vue'
import Slider from '../../ui/Slider.vue'

const bg = useBackgroundStore()

const bgTabs = [
    { id: 'solid', label: 'Solid' },
    { id: 'gradient', label: 'Gradient' },
    { id: 'none', label: 'None' },
]

const categoryLabels: Record<string, string> = {
    neon: 'Neon',
    nature: 'Nature',
    retro: 'Retro',
    moody: 'Moody',
    pastel: 'Pastel',
    lux: 'Luxury',
    dark: 'Dark',
    special: 'Special',
}

const groupedGradients = gradientPresets.reduce((acc: Record<string, typeof gradientPresets>, g) => {
    if (!acc[g.category]) acc[g.category] = []
    const list = acc[g.category]
    if (list) list.push(g)
    return acc
}, {})

function selectGradient(css: string) {
    bg.setGradient(css)
    bg.setBgType('gradient')
}
</script>

<template>
    <Accordion title="Background" :icon="Image">
        <div class="space-y-4">
            <!-- Type Tabs -->
            <Tabs :tabs="bgTabs" :model-value="bg.bgType" @update:model-value="bg.setBgType($event as any)" />

            <!-- Solid Color -->
            <template v-if="bg.bgType === 'solid'">
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <input type="color" :value="bg.solidColor"
                            @input="bg.setSolidColor(($event.target as HTMLInputElement).value)"
                            class="w-10 h-10 rounded-lg cursor-pointer"
                            style="border: 1px solid var(--border-strong)" />
                        <input :value="bg.solidColor"
                            @input="bg.setSolidColor(($event.target as HTMLInputElement).value)"
                            class="input-field flex-1 font-mono text-xs" placeholder="#000000" />
                    </div>
                    <Slider v-model="bg.solidOpacity" :min="0" :max="1" :step="0.05" label="Opacity" />
                    <!-- Quick preset row -->
                    <div class="flex gap-1.5 flex-wrap">
                        <button
                            v-for="color in ['#000000', '#0a0a0a', '#111111', '#1a1a2e', '#0f172a', '#1e1b4b', '#0c1445', '#1a0533', '#2d1f1f', '#0a0e14', '#ffffff', '#f8fafc', '#fdf6e3', '#eff1f5']"
                            :key="color" @click="bg.setSolidColor(color)"
                            class="w-6 h-6 rounded-md cursor-pointer transition-transform hover:scale-110" :style="{
                                background: color,
                                border: bg.solidColor === color ? '2px solid var(--accent)' : '1px solid var(--border-strong)',
                                boxShadow: bg.solidColor === color ? '0 0 8px rgba(var(--accent-rgb),0.3)' : 'none'
                            }" />
                    </div>
                </div>
            </template>

            <!-- Gradient Presets -->
            <template v-if="bg.bgType === 'gradient'">
                <div class="space-y-3">
                    <!-- Current gradient preview -->
                    <div class="w-full h-16 rounded-lg"
                        :style="{ background: bg.gradientCss, border: '1px solid var(--border-strong)' }" />

                    <!-- Gradient presets by category -->
                    <div v-for="(gradients, category) in groupedGradients" :key="category" class="space-y-1.5">
                        <h4 class="text-[10px] font-display font-semibold uppercase tracking-wider"
                            style="color: var(--text-subtle)">
                            {{ categoryLabels[category] || category }}
                        </h4>
                        <div class="flex gap-1.5 flex-wrap">
                            <button v-for="gradient in gradients" :key="gradient.id"
                                @click="selectGradient(gradient.css)"
                                class="w-10 h-10 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105"
                                :style="{
                                    background: gradient.css,
                                    border: bg.gradientCss === gradient.css ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: bg.gradientCss === gradient.css ? '0 0 10px rgba(var(--accent-rgb), 0.25)' : 'none',
                                }" :title="gradient.name" />
                        </div>
                    </div>
                </div>
            </template>

            <!-- Transparent -->
            <template v-if="bg.bgType === 'none'">
                <div class="text-xs text-center py-4" style="color: var(--text-muted)">
                    Background will render as transparent.<br />
                    Export as PNG for alpha channel.
                </div>
            </template>
        </div>
    </Accordion>
</template>
