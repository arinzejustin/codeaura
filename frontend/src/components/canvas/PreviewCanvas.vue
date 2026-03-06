<script setup lang="ts">
/**
 * PreviewCanvas — The center canvas area with pan/zoom, scroll,
 * background rendering, and the code card centered within.
 * Supports touch gestures + mouse scroll for mobile.
 */
import { ref, computed } from 'vue'
import { useBackgroundStore } from '../../stores/background'
import { useFrameStore } from '../../stores/frame'
import CodeCard from './CodeCard.vue'

const bg = useBackgroundStore()
const frame = useFrameStore()

// Canvas zoom and pan state
const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const lastMouse = ref({ x: 0, y: 0 })

const exportRef = ref<HTMLElement | null>(null)

// Expose the export element ref to parent
defineExpose({ exportRef })

function handleWheel(e: WheelEvent) {
    // Only zoom when Ctrl/Cmd is held. Regular scroll is ignored.
    if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.05 : 0.05
        zoom.value = Math.max(0.25, Math.min(3, zoom.value + delta))
    }
    // No else — regular scroll does nothing on the canvas
}

function handleMouseDown(e: MouseEvent) {
    if (e.button === 1 || (e.button === 0 && e.altKey) || (e.button === 0)) {
        isDragging.value = true
        lastMouse.value = { x: e.clientX, y: e.clientY }
        e.preventDefault()
    }
}

function handleMouseMove(e: MouseEvent) {
    if (isDragging.value) {
        panX.value += e.clientX - lastMouse.value.x
        panY.value += e.clientY - lastMouse.value.y
        lastMouse.value = { x: e.clientX, y: e.clientY }
    }
}

function handleMouseUp() {
    isDragging.value = false
}

// Touch support for mobile scrolling
const lastTouch = ref({ x: 0, y: 0 })
const isTouching = ref(false)

function handleTouchStart(e: TouchEvent) {
    if (e.touches.length === 1) {
        isTouching.value = true
        lastTouch.value = { x: e.touches[0]!.clientX, y: e.touches[0]!.clientY }
    }
}

function handleTouchMove(e: TouchEvent) {
    if (isTouching.value && e.touches.length === 1) {
        e.preventDefault()
        const dx = e.touches[0]!.clientX - lastTouch.value.x
        const dy = e.touches[0]!.clientY - lastTouch.value.y
        panX.value += dx
        panY.value += dy
        lastTouch.value = { x: e.touches[0]!.clientX, y: e.touches[0]!.clientY }
    }
}

function handleTouchEnd() {
    isTouching.value = false
}

function resetView() {
    zoom.value = 1
    panX.value = 0
    panY.value = 0
}

const bgStyle = computed(() => {
    if (bg.bgType === 'none') return {}
    return bg.backgroundStyle
})
</script>

<template>
    <div class="relative w-full h-full overflow-hidden"
        :class="{ 'cursor-grab': !isDragging, 'cursor-grabbing': isDragging }"
        :style="{ background: bg.bgType === 'none' ? undefined : 'var(--surface-1)' }" @wheel="handleWheel"
        @mousedown="handleMouseDown" @mousemove="handleMouseMove" @mouseup="handleMouseUp" @mouseleave="handleMouseUp"
        @touchstart.passive="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
        <!-- Checkerboard for transparent mode -->
        <div v-if="bg.bgType === 'none'" class="absolute inset-0 checkerboard opacity-30" />

        <!-- Subtle grid pattern on canvas -->
        <div class="absolute inset-0 opacity-[0.03]" style="
      background-image: radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px);
      background-size: 24px 24px;
    " />

        <!-- Card container with zoom + pan -->
        <div class="absolute inset-0 flex items-center justify-center" :style="{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging || isTouching ? 'none' : 'transform 0.15s ease-out',
        }">
            <!-- Export wrapper: this is what gets rendered to image -->
            <div ref="exportRef" class="relative transition-all duration-300 ease-out" :style="{
                padding: frame.padding + 'px',
                ...bgStyle,
                borderRadius: (frame.borderRadius + 4) + 'px',
            }">
                <CodeCard />
            </div>
        </div>

        <!-- Zoom controls (bottom-right overlay) -->
        <div class="absolute bottom-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-lg"
            style="background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--glass-border);">
            <button @click="zoom = Math.max(0.25, zoom - 0.1)"
                class="w-6 h-6 flex items-center justify-center rounded text-xs hover:bg-white/5 transition-colors"
                style="color: var(--text-muted)">−</button>
            <span class="w-12 text-center text-[10px] font-mono tabular-nums" style="color: var(--text-secondary)">
                {{ Math.round(zoom * 100) }}%
            </span>
            <button @click="zoom = Math.min(3, zoom + 0.1)"
                class="w-6 h-6 flex items-center justify-center rounded text-xs hover:bg-white/5 transition-colors"
                style="color: var(--text-muted)">+</button>
            <div class="w-px h-4 mx-0.5" style="background: var(--border)" />
            <button @click="resetView"
                class="px-1.5 h-6 flex items-center justify-center rounded text-[10px] font-mono hover:bg-white/5 transition-colors"
                style="color: var(--text-muted)">Reset</button>
        </div>

        <!-- Keyboard shortcut hint (hidden on mobile) -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 items-center gap-3 px-3 py-1.5 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 hidden md:flex"
            style="background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--glass-border)">
            <span class="text-[10px] font-body" style="color: var(--text-subtle)">
                <kbd class="px-1 py-0.5 rounded text-[9px] font-mono" style="background: var(--surface-3)">Ctrl+E</kbd>
                Export
            </span>
            <span class="text-[10px] font-body" style="color: var(--text-subtle)">
                <kbd class="px-1 py-0.5 rounded text-[9px] font-mono" style="background: var(--surface-3)">Ctrl+C</kbd>
                Copy
            </span>
            <span class="text-[10px] font-body" style="color: var(--text-subtle)">
                <kbd class="px-1 py-0.5 rounded text-[9px] font-mono"
                    style="background: var(--surface-3)">Scroll</kbd> Pan
            </span>
        </div>
    </div>
</template>
