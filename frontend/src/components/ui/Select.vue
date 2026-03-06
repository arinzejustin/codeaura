<script setup lang="ts">
/**
 * Select — Custom shadcn-inspired select dropdown.
 * Glass-morphism styled, with search/filter, smooth animations.
 */
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { ChevronDown, Search, Check } from 'lucide-vue-next'

export interface SelectOption {
  value: string
  label: string
  icon?: any
}

const props = withDefaults(defineProps<{
  modelValue: string
  options: SelectOption[]
  placeholder?: string
  searchable?: boolean
  label?: string
}>(), {
  placeholder: 'Select...',
  searchable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const highlightIndex = ref(-1)

const selectedOption = computed(() =>
  props.options.find(o => o.value === props.modelValue)
)

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const q = searchQuery.value.toLowerCase()
  return props.options.filter(o => o.label.toLowerCase().includes(q))
})

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
    highlightIndex.value = -1
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  }
}

function selectOption(option: SelectOption) {
  emit('update:modelValue', option.value)
  isOpen.value = false
  searchQuery.value = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (!isOpen.value) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault()
      isOpen.value = true
      return
    }
    return
  }

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightIndex.value = Math.min(
        highlightIndex.value + 1,
        filteredOptions.value.length - 1
      )
      break
    case 'ArrowUp':
      e.preventDefault()
      highlightIndex.value = Math.max(highlightIndex.value - 1, 0)
      break
    case 'Enter':
      e.preventDefault()
      const highlighted = filteredOptions.value[highlightIndex.value]
      if (highlightIndex.value >= 0 && highlighted) {
        selectOption(highlighted)
      }
      break
    case 'Escape':
      e.preventDefault()
      isOpen.value = false
      break
  }
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node
  if (
    triggerRef.value && !triggerRef.value.contains(target) &&
    dropdownRef.value && !dropdownRef.value.contains(target)
  ) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

// Reset highlight when search changes
watch(searchQuery, () => {
  highlightIndex.value = 0
})
</script>

<template>
  <div class="select-root relative">
    <!-- Label -->
    <label v-if="label" class="text-xs font-body block mb-1.5" style="color: var(--text-secondary)">
      {{ label }}
    </label>

    <!-- Trigger -->
    <button
      ref="triggerRef"
      type="button"
      class="select-trigger"
      :class="{ 'select-trigger--open': isOpen }"
      @click="toggle"
      @keydown="handleKeydown"
    >
      <span class="select-trigger__label">
        {{ selectedOption?.label || placeholder }}
      </span>
      <ChevronDown
        class="select-trigger__chevron"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="select-enter-active"
      enter-from-class="select-enter-from"
      enter-to-class="select-enter-to"
      leave-active-class="select-leave-active"
      leave-from-class="select-leave-from"
      leave-to-class="select-leave-to"
    >
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="select-dropdown"
      >
        <!-- Search -->
        <div v-if="searchable" class="select-search">
          <Search class="select-search__icon" />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            class="select-search__input"
            placeholder="Search..."
            @keydown="handleKeydown"
          />
        </div>

        <!-- Options -->
        <div class="select-options" role="listbox">
          <button
            v-for="(option, index) in filteredOptions"
            :key="option.value"
            class="select-option"
            :class="{
              'select-option--selected': option.value === modelValue,
              'select-option--highlighted': index === highlightIndex,
            }"
            role="option"
            :aria-selected="option.value === modelValue"
            @click="selectOption(option)"
            @mouseenter="highlightIndex = index"
          >
            <component v-if="option.icon" :is="option.icon" class="w-3.5 h-3.5 flex-shrink-0" />
            <span class="select-option__label">{{ option.label }}</span>
            <Check
              v-if="option.value === modelValue"
              class="select-option__check"
            />
          </button>
          <div v-if="filteredOptions.length === 0" class="select-empty">
            No results found
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.select-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-family: var(--font-body, inherit);
  cursor: pointer;
  transition: all 0.15s ease;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-primary);
  outline: none;
}

.select-trigger:hover {
  border-color: var(--border-strong);
  background: var(--surface-3);
}

.select-trigger:focus-visible {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
}

.select-trigger--open {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
}

.select-trigger__label {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-trigger__chevron {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: var(--text-muted);
  transition: transform 0.2s ease;
}

/* Dropdown */
.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  margin-top: 4px;
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
}

/* Animations */
.select-enter-active,
.select-leave-active {
  transition: all 0.15s ease;
}

.select-enter-from,
.select-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}

.select-enter-to,
.select-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Search */
.select-search {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--border);
}

.select-search__icon {
  width: 13px;
  height: 13px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.select-search__input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 11px;
  color: var(--text-primary);
  font-family: var(--font-body, inherit);
}

.select-search__input::placeholder {
  color: var(--text-subtle);
}

/* Options list */
.select-options {
  max-height: 200px;
  overflow-y: auto;
  padding: 4px;
}

.select-options::-webkit-scrollbar {
  width: 4px;
}

.select-options::-webkit-scrollbar-track {
  background: transparent;
}

.select-options::-webkit-scrollbar-thumb {
  background: var(--border-strong);
  border-radius: 4px;
}

/* Single option */
.select-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-family: var(--font-body, inherit);
  cursor: pointer;
  transition: all 0.1s ease;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  text-align: left;
}

.select-option:hover,
.select-option--highlighted {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.select-option--selected {
  color: var(--accent);
  font-weight: 500;
}

.select-option__label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-option__check {
  width: 13px;
  height: 13px;
  color: var(--accent);
  flex-shrink: 0;
}

.select-empty {
  padding: 12px;
  text-align: center;
  font-size: 11px;
  color: var(--text-subtle);
}
</style>
