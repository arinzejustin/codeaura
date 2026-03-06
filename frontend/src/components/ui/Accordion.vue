<script setup lang="ts">
/**
 * Accordion — Collapsible section with smooth height animation.
 * Uses CSS max-height transition for buttery-smooth open/close.
 */
import { ref, watch, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  icon?: any
  defaultOpen?: boolean
}>(), {
  defaultOpen: false,
})

const isOpen = ref(props.defaultOpen)
const contentRef = ref<HTMLElement | null>(null)
const contentHeight = ref(props.defaultOpen ? 'none' : '0px')

function toggle() {
  if (isOpen.value) {
    // Closing: set to current height then animate to 0
    if (contentRef.value) {
      contentHeight.value = contentRef.value.scrollHeight + 'px'
      requestAnimationFrame(() => {
        contentHeight.value = '0px'
      })
    }
    isOpen.value = false
  } else {
    isOpen.value = true
    nextTick(() => {
      if (contentRef.value) {
        contentHeight.value = contentRef.value.scrollHeight + 'px'
        // After transition, set to none for dynamic content
        setTimeout(() => {
          if (isOpen.value) contentHeight.value = 'none'
        }, 400)
      }
    })
  }
}

// Initialize properly when defaultOpen is true  
watch(() => props.defaultOpen, (val) => {
  if (val && !isOpen.value) {
    isOpen.value = true
    nextTick(() => {
      contentHeight.value = 'none'
    })
  }
}, { immediate: true })
</script>

<template>
  <div class="border-b" style="border-color: var(--border)">
    <!-- Header button -->
    <button
      @click="toggle"
      class="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors duration-150 group"
    >
      <div class="flex items-center gap-2.5">
        <!-- Icon slot -->
        <component :is="icon" v-if="icon" class="w-4 h-4 opacity-50 group-hover:opacity-80 transition-opacity" />
        <span class="section-header">{{ title }}</span>
      </div>
      <!-- Chevron -->
      <svg
        class="w-3.5 h-3.5 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
        :style="{ color: 'var(--text-subtle)' }"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Content with smooth height animation -->
    <div
      ref="contentRef"
      class="overflow-hidden transition-all duration-400 ease-in-out"
      :style="{ maxHeight: contentHeight }"
    >
      <div class="px-4 pb-4 pt-1">
        <slot />
      </div>
    </div>
  </div>
</template>
