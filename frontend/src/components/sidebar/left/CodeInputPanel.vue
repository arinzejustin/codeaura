<script setup lang="ts">
/**
 * CodeInputPanel — Code input with CodeMirror editor,
 * language selector, and quick actions.
 */
import { computed } from 'vue'
import { useEditorStore } from '../../../stores/editor'
import { languages } from '../../../data/languages'
import { Keyboard } from 'lucide-vue-next'
import Accordion from '../../ui/Accordion.vue'
import Select from '../../ui/Select.vue'
import type { SelectOption } from '../../ui/Select.vue'
import CodeMirrorEditor from '../../editor/CodeMirrorEditor.vue'

const editor = useEditorStore()

const languageOptions = computed<SelectOption[]>(() =>
  languages.map(lang => ({ value: lang.id, label: lang.name }))
)

async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText()
        editor.setCode(text)
    } catch {
        // Clipboard API may fail
    }
}

function handleClear() {
    if (editor.code.length > 0) {
        editor.clearCode()
    }
}
</script>

<template>
    <Accordion title="Code Input" :icon="Keyboard" :default-open="true">
        <div class="space-y-3">
            <!-- Language Selector -->
            <Select
                :model-value="editor.language"
                @update:model-value="editor.setLanguage"
                :options="languageOptions"
                label="Language"
                :searchable="true"
                placeholder="Select language..."
            />

            <!-- Code Editor -->
            <CodeMirrorEditor :model-value="editor.code" :language="editor.language"
                @update:model-value="editor.setCode" />

            <!-- Quick Actions -->
            <div class="flex gap-2">
                <button @click="pasteFromClipboard" class="btn-surface flex-1 flex items-center justify-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Paste
                </button>
                <button @click="handleClear" class="btn-surface flex-1 flex items-center justify-center gap-1.5">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear
                </button>
            </div>

            <!-- File Name -->
            <div class="space-y-1.5">
                <label class="text-xs font-body" style="color: var(--text-secondary)">File Name</label>
                <input v-model="editor.fileName" type="text" class="input-field text-xs" placeholder="untitled.ts" />
            </div>
        </div>
    </Accordion>
</template>
