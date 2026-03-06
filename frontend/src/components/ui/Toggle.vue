<script setup lang="ts">
/**
 * Toggle — Switch with label.
 */
const props = defineProps<{
  modelValue: boolean
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function toggle() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div class="flex items-center justify-between">
    <label v-if="label" class="text-xs font-body" style="color: var(--text-secondary)">
      {{ label }}
    </label>
    <button
      @click="toggle"
      class="relative w-9 h-5 rounded-full transition-all duration-200 flex-shrink-0"
      :style="{
        background: modelValue ? 'var(--accent)' : 'var(--surface-3)',
        boxShadow: modelValue ? '0 0 12px rgba(var(--accent-rgb), 0.3)' : 'none'
      }"
      role="switch"
      :aria-checked="modelValue"
    >
      <span
        class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-200"
        :class="{ 'translate-x-4': modelValue }"
        :style="{ background: modelValue ? 'var(--surface-0)' : 'var(--text-muted)' }"
      />
    </button>
  </div>
</template>
