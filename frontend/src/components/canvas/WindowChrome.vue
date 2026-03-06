<script setup lang="ts">
/**
 * WindowChrome — Renders window title bar with traffic lights/controls.
 * Supports: macOS dark/light, Windows 11, Terminal, Minimal, None.
 */
import { useFrameStore } from '../../stores/frame'

const frame = useFrameStore()

defineProps<{
    title: string
}>()
</script>

<template>
    <!-- macOS Dark -->
    <div v-if="frame.windowStyle === 'macos-dark'" class="flex items-center px-4 py-3 relative" :style="{
        background: 'rgba(0,0,0,0.35)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        borderRadius: `${frame.borderRadius}px ${frame.borderRadius}px 0 0`,
    }">
        <!-- Traffic lights -->
        <div v-if="frame.trafficLightStyle !== 'hidden'" class="flex gap-2">
            <span class="w-3 h-3 rounded-full" :style="{
                background: frame.trafficLightStyle === 'colored' ? '#ff5f57' :
                    frame.trafficLightStyle === 'monochrome' ? '#555' : 'transparent',
                border: frame.trafficLightStyle === 'outlined' ? '1.5px solid #ff5f57' : 'none',
            }" />
            <span class="w-3 h-3 rounded-full" :style="{
                background: frame.trafficLightStyle === 'colored' ? '#febc2e' :
                    frame.trafficLightStyle === 'monochrome' ? '#555' : 'transparent',
                border: frame.trafficLightStyle === 'outlined' ? '1.5px solid #febc2e' : 'none',
            }" />
            <span class="w-3 h-3 rounded-full" :style="{
                background: frame.trafficLightStyle === 'colored' ? '#28c840' :
                    frame.trafficLightStyle === 'monochrome' ? '#555' : 'transparent',
                border: frame.trafficLightStyle === 'outlined' ? '1.5px solid #28c840' : 'none',
            }" />
        </div>
        <!-- Title (centered) -->
        <span v-if="frame.showTitle"
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-body"
            style="color: rgba(255,255,255,0.5)" :class="{ 'text-center': frame.titleAlignment === 'center' }">
            {{ title }}
        </span>
    </div>

    <!-- macOS Light -->
    <div v-else-if="frame.windowStyle === 'macos-light'" class="flex items-center px-4 py-3 relative" :style="{
        background: 'rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        borderRadius: `${frame.borderRadius}px ${frame.borderRadius}px 0 0`,
    }">
        <div v-if="frame.trafficLightStyle !== 'hidden'" class="flex gap-2">
            <span class="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span class="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span class="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span v-if="frame.showTitle"
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-body"
            style="color: rgba(255,255,255,0.4)">
            {{ title }}
        </span>
    </div>

    <!-- Windows 11 -->
    <div v-else-if="frame.windowStyle === 'windows-11'" class="flex items-center justify-between px-4 py-2.5" :style="{
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        borderRadius: `${frame.borderRadius}px ${frame.borderRadius}px 0 0`,
    }">
        <span v-if="frame.showTitle" class="text-xs font-body" style="color: rgba(255,255,255,0.5)">
            {{ title }}
        </span>
        <span v-else />
        <!-- Window controls (right side) -->
        <div class="flex gap-3">
            <svg class="w-3 h-3 opacity-40" fill="currentColor" viewBox="0 0 12 12">
                <rect y="5" width="12" height="1.5" rx="0.75" />
            </svg>
            <svg class="w-3 h-3 opacity-40" fill="currentColor" viewBox="0 0 12 12">
                <rect x="1" y="1" width="10" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5" />
            </svg>
            <svg class="w-3 h-3 opacity-40" fill="currentColor" viewBox="0 0 12 12">
                <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
        </div>
    </div>

    <!-- Terminal -->
    <div v-else-if="frame.windowStyle === 'terminal'" class="flex items-center px-4 py-2.5" :style="{
        background: '#000000',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        borderRadius: `${frame.borderRadius}px ${frame.borderRadius}px 0 0`,
    }">
        <div class="flex items-center gap-2">
            <span class="text-xs" style="color: rgba(255,255,255,0.3)">▶</span>
            <span v-if="frame.showTitle" class="text-xs font-mono" style="color: rgba(255,255,255,0.5)">
                {{ title }}
            </span>
        </div>
    </div>

    <!-- Minimal -->
    <div v-else-if="frame.windowStyle === 'minimal'" class="h-3"
        :style="{ borderRadius: `${frame.borderRadius}px ${frame.borderRadius}px 0 0` }" />

    <!-- None — no chrome rendered -->
</template>
