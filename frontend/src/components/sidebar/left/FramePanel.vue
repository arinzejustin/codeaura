<script setup lang="ts">
/**
 * FramePanel — Window chrome, padding, sizing, and shadow controls.
 */
import { useFrameStore, type WindowStyle } from '../../../stores/frame'
import { Layout, Monitor, Square, Terminal as TerminalIcon, Minus, CircleOff } from 'lucide-vue-next'
import Accordion from '../../ui/Accordion.vue'
import Slider from '../../ui/Slider.vue'
import Toggle from '../../ui/Toggle.vue'

const frame = useFrameStore()

const windowStyles: { id: WindowStyle; label: string; icon: any }[] = [
    { id: 'macos-dark', label: 'macOS Dark', icon: Monitor },
    { id: 'macos-light', label: 'macOS Light', icon: Monitor },
    { id: 'windows-11', label: 'Windows 11', icon: Square },
    { id: 'terminal', label: 'Terminal', icon: TerminalIcon },
    { id: 'minimal', label: 'Minimal', icon: Minus },
    { id: 'none', label: 'None', icon: CircleOff },
]

const shadowPresets = [
    { id: 'none', label: 'None', css: 'none' },
    { id: 'subtle', label: 'Subtle', css: '0 4px 16px rgba(0,0,0,0.3)' },
    { id: 'medium', label: 'Medium', css: '0 8px 32px rgba(0,0,0,0.4)' },
    { id: 'dramatic', label: 'Dramatic', css: '0 20px 60px rgba(0,0,0,0.5)' },
    { id: 'cinematic', label: 'Cinematic', css: '0 25px 80px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.4)' },
    { id: 'neon-violet', label: 'Neon Violet', css: '0 20px 60px rgba(139,92,246,0.35), 0 0 20px rgba(139,92,246,0.2)' },
    { id: 'neon-cyan', label: 'Neon Cyan', css: '0 20px 60px rgba(6,182,212,0.35), 0 0 20px rgba(6,182,212,0.2)' },
    { id: 'neon-pink', label: 'Neon Pink', css: '0 20px 60px rgba(236,72,153,0.35), 0 0 20px rgba(236,72,153,0.2)' },
    { id: 'neon-amber', label: 'Neon Amber', css: '0 20px 60px rgba(245,158,11,0.35), 0 0 20px rgba(245,158,11,0.2)' },
]
</script>

<template>
    <Accordion title="Window & Frame" :icon="Layout">
        <div class="space-y-4">
            <!-- Window Style -->
            <div class="space-y-1.5">
                <label class="text-xs font-body" style="color: var(--text-secondary)">Window Chrome</label>
                <div class="grid grid-cols-3 gap-1">
                    <button v-for="style in windowStyles" :key="style.id" @click="frame.setWindowStyle(style.id)"
                        class="flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-[10px] font-body transition-all duration-150"
                        :style="{
                            background: frame.windowStyle === style.id ? 'var(--surface-3)' : 'transparent',
                            border: frame.windowStyle === style.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                            color: frame.windowStyle === style.id ? 'var(--text-primary)' : 'var(--text-muted)',
                        }">
                        <component :is="style.icon" class="w-3.5 h-3.5" />
                        <span>{{ style.label }}</span>
                    </button>
                </div>
            </div>

            <!-- Window Title -->
            <div class="space-y-1.5">
                <label class="text-xs font-body" style="color: var(--text-secondary)">Window Title</label>
                <input v-model="frame.windowTitle" class="input-field text-xs" placeholder="untitled" />
            </div>
            <Toggle v-model="frame.showTitle" label="Show Title" />

            <!-- Padding -->
            <Slider v-model="frame.padding" :min="0" :max="160" :step="4" label="Outer Padding" suffix="px" />
            <Slider v-model="frame.innerPadding" :min="0" :max="64" :step="4" label="Inner Padding" suffix="px" />

            <!-- Border Radius -->
            <Slider v-model="frame.borderRadius" :min="0" :max="32" :step="1" label="Border Radius" suffix="px" />

            <!-- Width -->
            <Slider v-model="frame.width" :min="200" :max="1200" :step="20" label="Width" suffix="px" />

            <!-- Shadow -->
            <div class="space-y-1.5">
                <label class="text-xs font-body" style="color: var(--text-secondary)">Shadow</label>
                <div class="grid grid-cols-3 gap-1">
                    <button v-for="preset in shadowPresets" :key="preset.id"
                        @click="frame.setShadow(preset.id, preset.css)"
                        class="px-2 py-1.5 rounded-md text-[10px] font-body transition-all duration-150" :style="{
                            background: frame.shadowPreset === preset.id ? 'var(--surface-3)' : 'transparent',
                            border: frame.shadowPreset === preset.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                            color: frame.shadowPreset === preset.id ? 'var(--text-primary)' : 'var(--text-muted)',
                        }">
                        {{ preset.label }}
                    </button>
                </div>
            </div>

            <!-- Line Numbers -->
            <Toggle v-model="frame.showLineNumbers" label="Line Numbers" />
        </div>
    </Accordion>
</template>
