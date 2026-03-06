/* ─── EDITOR STORE ─── 
 * Manages code content, language, and editor settings.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEditorStore = defineStore('editor', () => {
  // ── State ──
  const code = ref(`// Welcome to CodeAura ✨
// The premium code-to-image tool

function fibonacci(n: number): number {
  if (n <= 1) return n;
  
  const memo = new Map<number, number>();
  
  function fib(k: number): number {
    if (k <= 1) return k;
    if (memo.has(k)) return memo.get(k)!;
    
    const result = fib(k - 1) + fib(k - 2);
    memo.set(k, result);
    return result;
  }
  
  return fib(n);
}

// Generate first 10 Fibonacci numbers
const sequence = Array.from(
  { length: 10 },
  (_, i) => fibonacci(i)
);

console.log("Fibonacci:", sequence);
// → [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`)

  const language = ref('typescript')
  const fileName = ref('fibonacci.ts')
  const tabSize = ref(2)
  const wordWrap = ref(false)
  const showWhitespace = ref(false)
  const showIndentGuides = ref(false)

  // ── Computed ──
  const lineCount = computed(() => code.value.split('\n').length)

  // ── Actions ──
  function setCode(newCode: string) {
    code.value = newCode
  }

  function setLanguage(lang: string) {
    language.value = lang
  }

  function clearCode() {
    code.value = ''
  }

  return {
    code,
    language,
    fileName,
    tabSize,
    wordWrap,
    showWhitespace,
    showIndentGuides,
    lineCount,
    setCode,
    setLanguage,
    clearCode,
  }
})
