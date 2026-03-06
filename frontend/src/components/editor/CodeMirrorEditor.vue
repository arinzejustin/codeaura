<script setup lang="ts">
/**
 * CodeMirrorEditor — Syntax-highlighted code editor for the sidebar.
 * Uses CodeMirror 6 with dynamic language loading.
 */
import { ref, onMounted, watch, shallowRef } from 'vue'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, lineNumbers } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { oneDark } from '@codemirror/theme-one-dark'
import { getLanguageById } from '../../data/languages'

const props = defineProps<{
  modelValue: string
  language: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editorContainer = ref<HTMLElement | null>(null)
const view = shallowRef<EditorView | null>(null)

/** Build CodeMirror extensions */
async function getExtensions() {
  const extensions = [
    lineNumbers(),
    history(),
    keymap.of([...defaultKeymap, ...historyKeymap]),
    syntaxHighlighting(defaultHighlightStyle),
    oneDark,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        emit('update:modelValue', update.state.doc.toString())
      }
    }),
    EditorView.theme({
      '&': { 
        fontSize: '13px',
        background: 'transparent',
      },
      '.cm-content': { 
        fontFamily: "'DM Mono', 'Fira Code', monospace",
        padding: '8px 0',
      },
      '.cm-gutters': {
        background: 'transparent',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        color: 'var(--text-subtle)',
        fontSize: '11px',
      },
      '.cm-activeLine': {
        background: 'rgba(255,255,255,0.03)',
      },
      '.cm-selectionBackground': {
        background: 'rgba(226, 168, 75, 0.15) !important',
      },
      '&.cm-focused .cm-selectionBackground': {
        background: 'rgba(226, 168, 75, 0.2) !important',
      },
      '.cm-cursor': {
        borderLeft: '2px solid var(--accent)',
      },
    }),
  ]

  // Load language support dynamically
  const langDef = getLanguageById(props.language)
  if (langDef?.cmLoader) {
    try {
      const langExt = await langDef.cmLoader()
      extensions.push(langExt)
    } catch (e) {
      console.warn(`Failed to load language: ${props.language}`, e)
    }
  }

  return extensions
}

/** Initialize or reinitialize the editor */
async function initEditor() {
  if (!editorContainer.value) return

  // Destroy old editor
  if (view.value) {
    view.value.destroy()
  }

  const extensions = await getExtensions()

  const state = EditorState.create({
    doc: props.modelValue,
    extensions,
  })

  view.value = new EditorView({
    state,
    parent: editorContainer.value,
  })
}

onMounted(() => {
  initEditor()
})

// Re-init when language changes
watch(() => props.language, () => {
  initEditor()
})

// Sync external value changes
watch(() => props.modelValue, (newVal) => {
  if (view.value && view.value.state.doc.toString() !== newVal) {
    view.value.dispatch({
      changes: {
        from: 0,
        to: view.value.state.doc.length,
        insert: newVal,
      }
    })
  }
})
</script>

<template>
  <div 
    ref="editorContainer"
    class="w-full rounded-lg overflow-hidden"
    style="background: var(--surface-2); border: 1px solid var(--border); min-height: 200px; max-height: 360px;"
  />
</template>
