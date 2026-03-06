<script setup lang="ts">
/**
 * CodeCard — The actual rendered code card with syntax highlighting,
 * window chrome, and all decorations. This is what gets exported.
 */
import { computed } from 'vue'
import { useEditorStore } from '../../stores/editor'
import { useThemeStore } from '../../stores/theme'
import { useFrameStore } from '../../stores/frame'
import { getFontById } from '../../data/fonts'
import WindowChrome from './WindowChrome.vue'

const editor = useEditorStore()
const theme = useThemeStore()
const frame = useFrameStore()

const currentFont = computed(() => getFontById(frame.fontId))
const codeLines = computed(() => editor.code.split('\n'))

/** Parse highlighted line ranges like "3, 7-11, 15" */
const highlightedLineSet = computed(() => {
    const set = new Set<number>()
    if (!frame.highlightedLines) return set
    const parts = frame.highlightedLines.split(',').map((s: string) => s.trim())
    for (const part of parts) {
        if (part.includes('-')) {
            const rangeParts = part.split('-').map(Number)
            if (rangeParts.length === 2) {
                const a = rangeParts[0] as number
                const b = rangeParts[1] as number
                if (!isNaN(a) && !isNaN(b)) {
                    for (let i = a; i <= b; i++) set.add(i)
                }
            }
        } else {
            const n = Number(part)
            if (!isNaN(n)) set.add(n)
        }
    }
    return set
})

/** Simple syntax tokenizer using theme colors */
function tokenize(line: string): { text: string; color: string }[] {
    const colors = theme.currentTheme?.colors || {
        foreground: '#fff', comment: '#888', string: '#aaa', number: '#aaa',
        keyword: '#aaa', type: '#aaa', function: '#aaa', punctuation: '#aaa', operator: '#aaa'
    }

    // Simple regex-based tokenizer for visual effect

    // Simple approach: colorize whole line with basic pattern matching
    let remaining = line
    if (!remaining) return [{ text: ' ', color: colors.foreground }]

    // Check for full-line comment
    if (/^\s*(\/\/|#|\/\*)/.test(remaining)) {
        return [{ text: remaining, color: colors.comment }]
    }

    // Otherwise do simple word-level coloring
    const result: { text: string; color: string }[] = []
    const wordRegex = /(\s+)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+\.?\d*\b)|(\b(?:const|let|var|function|return|if|else|for|while|class|import|export|from|default|new|this|async|await|try|catch|throw|switch|case|break|continue|typeof|instanceof|in|of|interface|type|enum|extends|implements|abstract|public|private|protected|static|readonly|void|null|undefined|true|false|def|self|None|True|False|fn|pub|use|mod|struct|impl|trait|match|loop|mut|ref|println|print|func|package|go|defer)\b)|(=>|===|!==|==|!=|<=|>=|\|\||&&|[+\-*/%=<>!&|^~?:;,.])|(\b[A-Z][a-zA-Z0-9]*\b)|(\b[a-zA-Z_]\w*)(\s*\()|([\[\]{}()])|([^\s]+)/g

    let match: RegExpExecArray | null
    while ((match = wordRegex.exec(remaining)) !== null) {
        const [full, space, str, num, keyword, op, typeName, funcName, funcParen, bracket] = match
        if (space) {
            result.push({ text: space, color: colors.foreground })
        } else if (str) {
            result.push({ text: str, color: colors.string })
        } else if (num) {
            result.push({ text: num, color: colors.number })
        } else if (keyword) {
            result.push({ text: keyword, color: colors.keyword })
        } else if (op) {
            result.push({ text: op, color: colors.operator })
        } else if (typeName) {
            result.push({ text: typeName, color: colors.type })
        } else if (funcName) {
            result.push({ text: funcName, color: colors.function })
            if (funcParen) result.push({ text: funcParen, color: colors.punctuation })
        } else if (bracket) {
            result.push({ text: bracket, color: colors.punctuation })
        } else {
            result.push({ text: full, color: colors.foreground })
        }
    }

    return result.length ? result : [{ text: line, color: theme.currentTheme?.colors?.foreground || '#fff' }]
}
</script>

<template>
    <div class="code-card transition-all duration-300 ease-out" :style="{
        width: frame.width + 'px',
        borderRadius: frame.borderRadius + 'px',
        boxShadow: frame.shadow,
        overflow: 'hidden',
    }">
        <!-- Window Chrome -->
        <WindowChrome :title="frame.showTitle ? (frame.windowTitle || editor.fileName) : ''" />

        <!-- Code Area -->
        <div class="relative overflow-auto" :style="{
            background: theme.currentTheme?.colors?.background || '#000',
            padding: frame.innerPadding + 'px',
            borderRadius: frame.windowStyle === 'none' ? frame.borderRadius + 'px' :
                `0 0 ${frame.borderRadius}px ${frame.borderRadius}px`,
        }">
            <pre class="m-0 p-0" :style="{
                fontFamily: currentFont?.family || 'monospace',
                fontSize: frame.fontSize + 'px',
                lineHeight: frame.lineHeight,
                fontWeight: frame.fontWeight,
                letterSpacing: frame.letterSpacing + 'px',
                fontFeatureSettings: frame.ligatures ? '\'liga\' 1, \'calt\' 1' : '\'liga\' 0, \'calt\' 0',
                tabSize: editor.tabSize,
            }"> <code style="font-family: inherit"><template v-for="(line, index) in codeLines" :key="index"><div
        class="flex transition-colors duration-200"
        :style="{
            background: highlightedLineSet.has(index + frame.lineNumberStart)
                ? 'rgba(226, 168, 75, 0.08)'
                : 'transparent',
            borderLeft: highlightedLineSet.has(index + frame.lineNumberStart)
                ? '2px solid var(--accent, #e2a84b)'
                : '2px solid transparent',
            paddingLeft: '4px',
            minHeight: (frame.fontSize * frame.lineHeight) + 'px',
        }"
      ><span
            v-if="frame.showLineNumbers"
            class="select-none text-right mr-4 flex-shrink-0"
            :style="{
                width: (Math.max(2, String(codeLines.length).length) * 0.6) + 'em',
                color: theme.currentTheme?.colors?.comment || '#888',
                opacity: 0.5,
                fontSize: (frame.fontSize - 1) + 'px',
            }"
          >{{ index + frame.lineNumberStart }}</span><span class="flex-1"><template v-for="(token, ti) in tokenize(line)" :key="ti"><span :style="{ color: token.color }">{{ token.text }}</span></template></span>
</div></template></code></pre>
        </div>
    </div>
</template>
