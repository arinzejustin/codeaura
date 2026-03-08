<script setup lang="ts">
/**
 * ShareView — Read-only view of a shared code snapshot.
 * Shows just the code card with the exact config, plus a "Create yours" CTA.
 */
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { Sparkles, Eye, X } from 'lucide-vue-next'
import { getFontById } from '../data/fonts'
import { getThemeById } from '../data/themes'

interface SnapshotData {
    id: string
    code: string
    language: string
    config: {
        themeId: string
        fontId: string
        fontSize: number
        lineHeight: number
        padding: number
        innerPadding: number
        borderRadius: number
        width: number
        windowStyle: string
        showLineNumbers: boolean
        shadow: string
        bgType: string
        bgColor?: string
        bgGradient?: string
        showTitle: boolean
        windowTitle: string
    }
    views: number
    createdAt: string
}

const route = useRoute()
const snapshot = ref<SnapshotData | null>(null)
const loading = ref(true)
const error = ref('')
const showBanner = ref(true)

const API_URL = import.meta.env.VITE_API_URL || '/api'

const theme = computed(() => {
    if (!snapshot.value) return null
    return getThemeById(snapshot.value.config.themeId)
})

const font = computed(() => {
    if (!snapshot.value) return null
    return getFontById(snapshot.value.config.fontId)
})

const snapshotTitle = computed(() => {
    return snapshot.value?.config?.windowTitle || 'Code Snippet'
})

useHead({
    title: computed(() => `${snapshotTitle.value}`),
    meta: [
        { name: 'description', content: computed(() => `Check out this ${snapshot.value?.language || 'code'} snippet created with CodeAura. Beautiful themes, custom backgrounds, and pixel-perfect export.`) },
        { property: 'og:title', content: computed(() => `${snapshotTitle.value}`) },
        { property: 'og:description', content: computed(() => `View this ${snapshot.value?.language || 'code'} snippet. Create stunning code screenshots with beautiful themes and custom backgrounds.`) },
        { property: 'og:type', content: 'article' },
        { property: 'og:image', content: 'https://codeaura.fun/image/view.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: computed(() => `${snapshotTitle.value}`) },
        { name: 'twitter:description', content: computed(() => `View this ${snapshot.value?.language || 'code'} snippet. Create stunning code screenshots with beautiful themes and custom backgrounds.`) },
        { name: 'twitter:image', content: 'https://codeaura.fun/image/view.png' }
    ]
})

const codeLines = computed(() => {
    if (!snapshot.value) return []
    return snapshot.value.code.split('\n')
})

const bgStyle = computed(() => {
    if (!snapshot.value) return {}
    const cfg = snapshot.value.config
    if (cfg.bgType === 'solid') return { background: cfg.bgColor || '#1a1b26' }
    if (cfg.bgType === 'gradient') return { background: cfg.bgGradient || 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)' }
    return { background: 'transparent' }
})

/** Simple syntax tokenizer (same as CodeCard) */
function tokenize(line: string): { text: string; color: string }[] {
    const colors = theme.value?.colors || {
        foreground: '#fff', comment: '#888', string: '#aaa', number: '#aaa',
        keyword: '#aaa', type: '#aaa', function: '#aaa', punctuation: '#aaa', operator: '#aaa'
    }

    if (!line) return [{ text: ' ', color: colors.foreground }]

    if (/^\s*(\/\/|#|\/\*)/.test(line)) {
        return [{ text: line, color: colors.comment }]
    }

    const result: { text: string; color: string }[] = []
    const wordRegex = /(\s+)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+\.?\d*\b)|(\b(?:const|let|var|function|return|if|else|for|while|class|import|export|from|default|new|this|async|await|try|catch|throw|switch|case|break|continue|typeof|instanceof|in|of|interface|type|enum|extends|implements|abstract|public|private|protected|static|readonly|void|null|undefined|true|false|def|self|None|True|False|fn|pub|use|mod|struct|impl|trait|match|loop|mut|ref|println|print|func|package|go|defer)\b)|(=>|===|!==|==|!=|<=|>=|\|\||&&|[+\-*/%=<>!&|^~?:;,.])|(\b[A-Z][a-zA-Z0-9]*\b)|(\b[a-zA-Z_]\w*)(\s*\()|([[\]{}()])|([^\s]+)/g

    let match: RegExpExecArray | null
    while ((match = wordRegex.exec(line)) !== null) {
        const [full, space, str, num, keyword, op, typeName, funcName, funcParen, bracket] = match
        if (space) result.push({ text: space, color: colors.foreground })
        else if (str) result.push({ text: str, color: colors.string })
        else if (num) result.push({ text: num, color: colors.number })
        else if (keyword) result.push({ text: keyword, color: colors.keyword })
        else if (op) result.push({ text: op, color: colors.operator })
        else if (typeName) result.push({ text: typeName, color: colors.type })
        else if (funcName) {
            result.push({ text: funcName, color: colors.function })
            if (funcParen) result.push({ text: funcParen, color: colors.punctuation })
        } else if (bracket) result.push({ text: bracket, color: colors.punctuation })
        else result.push({ text: full || '', color: colors.foreground })
    }

    return result.length ? result : [{ text: line, color: colors.foreground }]
}

onMounted(async () => {
    const code = route.params.code as string

    try {
        const response = await fetch(`${API_URL}/snapshots/${code}`)

        if (!response.ok) {
            error.value = response.status === 404 ? 'Snapshot not found' : 'Failed to load snapshot'
            return
        }

        snapshot.value = await response.json()

        // Load the font
        if (font.value?.url) {
            const link = document.createElement('link')
            link.href = font.value.url
            link.rel = 'stylesheet'
            document.head.appendChild(link)
        }
    } catch {
        error.value = 'Failed to load snapshot'
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="w-screen h-screen flex flex-col items-center bg-[#08080c] text-white overflow-hidden">

        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center justify-center h-screen gap-4">
            <div class="w-8 h-8 rounded-full border-2 border-white/10 border-t-accent animate-spin" />
            <p class="text-sm text-white/50">Loading snapshot...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="flex flex-col items-center justify-center h-screen gap-3 text-center px-6">
            <div
                class="text-6xl font-extrabold bg-gradient-to-br from-accent to-accent-dim bg-clip-text text-transparent">
                404
            </div>
            <h2 class="text-xl font-semibold">{{ error }}</h2>
            <p class="text-sm text-white/50 max-w-[360px]">This snapshot may have been removed or the link is invalid.
            </p>
            <a href="/"
                class="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-accent to-accent-dim text-white shadow-lg shadow-amber-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-200">
                Create your own →
            </a>
        </div>

        <!-- Snapshot -->
        <template v-else-if="snapshot">
            <!-- Header -->
            <header
                class="w-full flex items-center justify-between px-6 py-4 border-b border-white/[0.06] backdrop-blur-xl">
                <a href="/" class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
                        style="background: var(--accent); color: var(--surface-0)">
                        C
                    </div>
                    <h1 class="text-sm font-display font-bold tracking-tight" style="color: var(--text-primary)">
                        Code<span style="color: var(--accent)">Aura</span>
                    </h1>
                    <span class="text-[9px] font-mono px-1.5 py-0.5 rounded-full hidden sm:inline"
                        style="background: var(--surface-2); color: var(--text-subtle); border: 1px solid var(--border)">
                        v1.0
                    </span>
                </a>
                <span class="flex items-center gap-1.5 text-[11px] text-white/40 font-mono">
                    <Eye class="w-3 h-3" />
                    {{ snapshot.views }} view{{ snapshot.views !== 1 ? 's' : '' }}
                </span>
            </header>

            <!-- Canvas area -->
            <div class="flex-1 w-full overflow-y-auto">
                <div class="flex min-h-full w-full p-2 md:p-6 py-10 md:py-16">
                    <div class="m-auto rounded-2xl max-w-full overflow-hidden flex-shrink-0" :style="bgStyle">
                        <div :style="{ padding: snapshot.config.padding + 'px' }"
                            class="flex items-center justify-center">
                            <!-- Code Card -->
                            <div class="overflow-hidden transition-all duration-300" :style="{
                                width: snapshot.config.width + 'px',
                                maxWidth: '100%',
                                borderRadius: snapshot.config.borderRadius + 'px',
                                boxShadow: snapshot.config.shadow,
                            }">
                                <!-- Window Chrome -->
                                <div v-if="snapshot.config.windowStyle !== 'none'"
                                    class="flex items-center px-4 py-3 gap-2 border-b border-white/[0.06]"
                                    :style="{ background: theme?.colors?.background || '#1a1b26' }">
                                    <div v-if="snapshot.config.windowStyle?.includes('macos')" class="flex gap-1.5">
                                        <span class="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                                        <span class="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                                        <span class="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                                    </div>
                                    <span v-if="snapshot.config.showTitle"
                                        class="flex-1 text-center text-xs text-white/40 font-body">
                                        {{ snapshot.config.windowTitle || 'untitled' }}
                                    </span>
                                </div>

                                <!-- Code area -->
                                <div class="overflow-auto" :style="{
                                    background: theme?.colors?.background || '#1a1b26',
                                    padding: snapshot.config.innerPadding + 'px',
                                }">
                                    <pre class="m-0 p-0" :style="{
                                        fontFamily: font?.family || 'monospace',
                                        fontSize: snapshot.config.fontSize + 'px',
                                        lineHeight: snapshot.config.lineHeight,
                                    }"> <code style="font-family: inherit"><template v-for="(line, index) in codeLines" :key="index"><div class="flex" :style="{ minHeight: (snapshot.config.fontSize * snapshot.config.lineHeight) + 'px' }"><span
                    v-if="snapshot.config.showLineNumbers"
                    class="select-none text-right mr-4 flex-shrink-0"
                    :style="{
                        width: (Math.max(2, String(codeLines.length).length) * 0.6) + 'em',
                        color: theme?.colors?.comment || '#888',
                        opacity: 0.5,
                        fontSize: (snapshot.config.fontSize - 1) + 'px',
                    }"
                  >{{ index + 1 }}</span><span class="flex-1"><template v-for="(token, ti) in tokenize(line)" :key="ti"><span :style="{ color: token.color }">{{ token.text }}</span></template></span>
</div></template></code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="showBanner" class="w-full relative flex justify-center px-6 py-5 border-t border-white/[0.06]">
                <button @click="showBanner = false"
                    class="absolute right-6 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                    <X class="w-4 h-4" />
                </button>
                <a href="/"
                    class="inline-flex group items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-accent shadow-lg shadow-accent/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/40 transition-all duration-200">
                    <Sparkles class="w-4 h-4 group-hover:rotate-12" />
                    Create yours with CodeAura
                </a>
            </div>
        </template>
    </div>
</template>
