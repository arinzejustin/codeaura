<script setup lang="ts">
/**
 * Tabs — Segmented tab buttons.
 */
const props = defineProps<{
    tabs: { id: string; label: string }[]
    modelValue: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()
</script>

<template>
    <div class="flex rounded-lg p-0.5 gap-0.5" style="background: var(--surface-2); border: 1px solid var(--border)">
        <button v-for="tab in tabs" :key="tab.id" @click="emit('update:modelValue', tab.id)"
            class="flex-1 px-3 py-1.5 rounded-md text-xs font-body font-medium transition-all duration-200" :style="{
                background: modelValue === tab.id ? 'var(--surface-3)' : 'transparent',
                color: modelValue === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: modelValue === tab.id ? 'var(--shadow-sm)' : 'none',
            }">
            {{ tab.label }}
        </button>
    </div>
</template>
