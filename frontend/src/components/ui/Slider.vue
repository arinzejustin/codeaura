<script setup lang="ts">
/**
 * Slider — Range input with live label display.
 */
const props = withDefaults(defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  label?: string
  suffix?: string
}>(), {
  min: 0,
  max: 100,
  step: 1,
  suffix: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', Number(target.value))
}
</script>

<template>
  <div class="space-y-1.5">
    <div class="flex items-center justify-between" v-if="label">
      <label class="text-xs font-body" style="color: var(--text-secondary)">
        {{ label }}
      </label>
      <span class="text-xs font-mono tabular-nums" style="color: var(--text-muted)">
        {{ modelValue }}{{ suffix }}
      </span>
    </div>
    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      @input="onInput"
      class="w-full cursor-pointer"
    />
  </div>
</template>
