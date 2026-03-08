<script setup lang="ts">
/**
 * App.vue — Root layout with 3-panel design:
 * Left Sidebar (customization) | Center Canvas (preview) | Right Sidebar (quick actions)
 * 
 * Glass-morphism panels, animated background, luxury developer tool aesthetic.
 * Mobile: Both sidebars are hidden, canvas area scrolls.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { Toaster, toast } from 'vue-sonner'
import { useHead } from '@unhead/vue'
import { useExport } from './composables/useExport'
import { useAuthStore } from './stores/auth'
import { useHistoryStore } from './stores/history'
import { useEditorStore } from './stores/editor'
import { useThemeStore } from './stores/theme'
import { useBackgroundStore } from './stores/background'
import { useFrameStore } from './stores/frame'

useHead({
  title: 'CodeAura | Transform Your Code into Beautiful Images',
  meta: [
    { name: 'description', content: 'The premium code-to-image tool. Create stunning code screenshots with 40+ beautiful themes, custom backgrounds, and pixel-perfect export. Make your code stand out on social media.' },
    { name: 'keywords', content: 'code to image, code screenshot, beautiful code, code snippets, developer tools, syntax highlighting, share code' },
    { property: 'og:title', content: 'CodeAura | Transform Your Code into Beautiful Images' },
    { property: 'og:description', content: 'The premium code-to-image tool. Create stunning code screenshots with beautiful themes, custom backgrounds, and pixel-perfect export.' }
  ]
})

// Left sidebar panels
import CodeInputPanel from './components/sidebar/left/CodeInputPanel.vue'
import ThemePanel from './components/sidebar/left/ThemePanel.vue'
import FontPanel from './components/sidebar/left/FontPanel.vue'
import BackgroundPanel from './components/sidebar/left/BackgroundPanel.vue'
import FramePanel from './components/sidebar/left/FramePanel.vue'
import ExportPanel from './components/sidebar/left/ExportPanel.vue'

// Center canvas
import PreviewCanvas from './components/canvas/PreviewCanvas.vue'

// Right sidebar panels
import PresetsPanel from './components/sidebar/right/PresetsPanel.vue'
import HistoryPanel from './components/sidebar/right/HistoryPanel.vue'
import SharePanel from './components/sidebar/right/SharePanel.vue'

const { exportImage, copyToClipboard } = useExport()
const auth = useAuthStore()
const historyStore = useHistoryStore()
const editorStore = useEditorStore()
const themeStore = useThemeStore()
const bgStore = useBackgroundStore()
const frameStore = useFrameStore()
const canvasRef = ref<InstanceType<typeof PreviewCanvas> | null>(null)

// Sidebar collapse state
const leftSidebarOpen = ref(true)
const rightSidebarOpen = ref(true)

// Mobile detection
const isMobile = ref(false)
function checkMobile() {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    leftSidebarOpen.value = false
    rightSidebarOpen.value = false
  }
}

// User menu dropdown
const showUserMenu = ref(false)

const showShortcutsModal = ref(false)
const neverShowShortcutsAgain = ref(false)

function closeShortcutsModal() {
  showShortcutsModal.value = false
  if (neverShowShortcutsAgain.value) {
    localStorage.setItem('hideShortcutsModal', 'true')
  }
}

async function handleExport() {
  saveToHistory()
  const el = canvasRef.value?.exportRef
  if (el) {
    await exportImage(el)
    toast.success('Image exported successfully!')
  }
}

async function handleCopy() {
  const el = canvasRef.value?.exportRef
  if (el) {
    const success = await copyToClipboard(el)
    if (success) {
      toast.success('Copied to clipboard!')
    } else {
      toast.error('Copy failed')
    }
  }
}

function handleLogin() {
  auth.loginWithGitHub()
}

function handleLogout() {
  auth.logout()
  showUserMenu.value = false
  toast.success('Signed out successfully')
}

async function trySyncHistory() {
  if (auth.isLoggedIn) {
    await historyStore.syncToApi()
  }
}

function saveToHistory() {
  if (!editorStore.code.trim() || editorStore.code === editorStore.defaultCode) return
  
  const payload = {
    themeId: themeStore.currentThemeId,
    language: editorStore.language,
    codePreview: editorStore.code.substring(0, 50).replace(/\s+/g, ' ').trim() + (editorStore.code.length > 50 ? '...' : ''),
    config: {
      bg: { ...bgStore.$state },
      frame: { ...frameStore.$state },
      theme: themeStore.currentThemeId,
      code: editorStore.code,
      language: editorStore.language,
    }
  }

  const latestEntry = historyStore.entries[0]
  
  // Rule: If we have an existing latest entry that isn't pinned, compare lengths
  // If the new code is more than 30% different in length, it's a "New Session"
  // Otherwise, it's just a tweak, so we "Update Session"
  if (latestEntry && !latestEntry.pinned) {
    const len1 = latestEntry.config.code?.length || 0
    const len2 = editorStore.code.length
    
    // Check if the change is significant (e.g. pasted a whole new block instead of typing ~30 characters)
    const isSignificantChange = Math.abs(len1 - len2) > Math.max(30, len1 * 0.3)
    const isDifferentLanguage = latestEntry.language !== editorStore.language && isSignificantChange

    if (isSignificantChange || isDifferentLanguage) {
      historyStore.addEntry(payload)
    } else {
      historyStore.updateLastEntry(payload)
    }
  } else {
    // Start entirely new session if 0 entries or the latest one is specifically pinned
    historyStore.addEntry(payload)
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case 'e':
        e.preventDefault()
        handleExport()
        break
      case 's':
        e.preventDefault()
        saveToHistory()
        toast.success('Settings auto-saved')
        break
    }
  }
}

function handleClickOutside() {
  showUserMenu.value = false
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', handleClickOutside)
  checkMobile()
  trySyncHistory()

  // Background auto-save loop
  let lastSavedSignature = ''
  autoSaveTimer = setInterval(() => {
    // Only save if code actually differs from default 'Fibonacci' placeholder
    if (editorStore.code.trim() && editorStore.code !== editorStore.defaultCode) {
      const currentSignature = editorStore.code.length + themeStore.currentThemeId + bgStore.bgType + frameStore.padding
      if (currentSignature !== lastSavedSignature) {
        saveToHistory()
        lastSavedSignature = currentSignature
      }
    }
  }, 5000)

  // Notify of auth errors if redirected from failed sign-in
  const params = new URLSearchParams(window.location.search)
  if (params.has('auth_error')) {
    const error = params.get('auth_error')
    toast.error(`Authentication failed: ${error}`, { duration: 5000 })
    // clean up URL string
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  // Show shortcuts modal on first load if not hidden
  if (!localStorage.getItem('hideShortcutsModal') && !isMobile.value) {
    setTimeout(() => {
      showShortcutsModal.value = true
    }, 1500)
  }
})

let autoSaveTimer: ReturnType<typeof setInterval>

onUnmounted(() => {
  clearInterval(autoSaveTimer)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="w-screen h-[100dvh] flex flex-col overflow-hidden" style="background: var(--surface-0)">
    <!-- Classic Dot Background -->
    <div class="app-bg"></div>

    <!-- Header Bar -->
    <header 
      class="relative z-20 flex items-center justify-between px-3 sm:px-5 flex-shrink-0"
      style="height: var(--header-height); border-bottom: 1px solid var(--border); background: var(--glass-bg); backdrop-filter: blur(20px);"
    >
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Sidebar toggle -->
        <button 
          @click="leftSidebarOpen = !leftSidebarOpen"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
          :style="{ color: leftSidebarOpen ? 'var(--accent)' : 'var(--text-muted)' }"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div 
            class="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
            style="background: var(--accent); color: var(--surface-0)"
          >
            C
          </div>
          <h1 class="text-sm font-display font-bold tracking-tight" style="color: var(--text-primary)">
            Code<span style="color: var(--accent)">Aura</span>
          </h1>
          <span class="text-[9px] font-mono px-1.5 py-0.5 rounded-full hidden sm:inline" style="background: var(--surface-2); color: var(--text-subtle); border: 1px solid var(--border)">
            v1.0
          </span>
        </div>
      </div>

      <!-- Center: Quick Export -->
      <div class="flex items-center gap-1.5 sm:gap-2">
        <button @click="handleExport" class="btn-accent flex items-center gap-1.5 text-xs py-1.5 px-2.5 sm:px-3">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span class="hidden sm:inline">Export</span>
        </button>
        <button @click="handleCopy" class="btn-ghost flex items-center gap-1.5 text-xs">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          <span class="hidden sm:inline">Copy</span>
        </button>
      </div>

      <!-- Right: Auth + Right sidebar toggle -->
      <div class="flex items-center gap-2">
        <!-- GitHub Sign In / User Avatar -->
        <div v-if="!auth.isLoggedIn">
          <button 
            @click.stop="handleLogin"
            class="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-2.5"
            :class="{ 'opacity-50 pointer-events-none': auth.isLoading }"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span class="hidden sm:inline">Sign in</span>
          </button>
        </div>
        <div v-else class="relative" @click.stop>
          <button 
            @click="showUserMenu = !showUserMenu"
            class="w-8 h-8 rounded-full overflow-hidden border-2 transition-colors hover:border-[var(--accent)] flex-shrink-0"
            :style="{ borderColor: showUserMenu ? 'var(--accent)' : 'var(--border)' }"
          >
            <img 
              v-if="auth.user?.avatarUrl" 
              :src="auth.user.avatarUrl" 
              :alt="auth.user.name || auth.user.login"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-xs font-bold" style="background: var(--accent); color: var(--surface-0)">
              {{ (auth.user?.login || '?')[0]!.toUpperCase() }}
            </div>
          </button>
          <!-- Dropdown -->
          <Transition
            enter-active-class="transition-all duration-150 ease-out"
            enter-from-class="opacity-0 scale-95 -translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-100 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div 
              v-if="showUserMenu" 
              class="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden z-50"
              style="background: var(--surface-2); border: 1px solid var(--border-strong); box-shadow: var(--shadow-lg)"
            >
              <div class="px-3 py-2.5" style="border-bottom: 1px solid var(--border)">
                <p class="text-xs font-medium" style="color: var(--text-primary)">{{ auth.user?.name || auth.user?.login }}</p>
                <p class="text-[10px] mt-0.5" style="color: var(--text-subtle)">{{ auth.user?.email || '@' + auth.user?.login }}</p>
              </div>
              <div class="py-1">
                <button 
                  @click="trySyncHistory"
                  class="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-white/5 transition-colors"
                  style="color: var(--text-secondary)"
                  :class="{ 'opacity-50': historyStore.isSyncing }"
                >
                  <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': historyStore.isSyncing }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {{ historyStore.isSyncing ? 'Syncing...' : 'Sync History' }}
                </button>
                <button 
                  @click="handleLogout"
                  class="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-white/5 transition-colors"
                  style="color: var(--text-secondary)"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Right sidebar toggle -->
        <button 
          @click="rightSidebarOpen = !rightSidebarOpen"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
          :style="{ color: rightSidebarOpen ? 'var(--accent)' : 'var(--text-muted)' }"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Content: 3-panel layout -->
    <div class="relative z-10 flex flex-1 overflow-hidden">
      <!-- ═══ LEFT SIDEBAR ═══ -->
      <aside
        class="flex-shrink-0 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-out no-scrollbar absolute z-40 h-full md:relative md:h-auto"
        :style="{
          width: leftSidebarOpen ? 'var(--sidebar-width)' : '0px',
          left: 0,
          opacity: leftSidebarOpen ? 1 : 0,
          borderRight: '1px solid var(--border)',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
        }"
      >
        <div class="w-[320px]">
          <CodeInputPanel />
          <ThemePanel />
          <FontPanel />
          <BackgroundPanel />
          <FramePanel />
          <ExportPanel @export="handleExport" @copy="handleCopy" />
        </div>
      </aside>

      <!-- ═══ CENTER CANVAS ═══ -->
      <main class="flex-1 min-w-0 relative">
        <PreviewCanvas ref="canvasRef" />
      </main>

      <!-- ═══ RIGHT SIDEBAR ═══ -->
      <aside
        class="flex-shrink-0 overflow-y-auto overflow-x-hidden transition-all duration-300 ease-out no-scrollbar absolute right-0 z-40 h-full md:relative md:h-auto"
        :style="{
          width: rightSidebarOpen ? 'var(--right-panel-width)' : '0px',
          opacity: rightSidebarOpen ? 1 : 0,
          borderLeft: '1px solid var(--border)',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
        }"
      >
        <div class="w-[280px] p-4 space-y-6">
          <PresetsPanel />
          <div style="border-top: 1px solid var(--border)" class="pt-4">
            <HistoryPanel />
          </div>
          <div style="border-top: 1px solid var(--border)" class="pt-4">
            <SharePanel />
          </div>
        </div>
      </aside>
    </div>
  </div>

  <!-- Shortcuts Modal -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95 translate-y-4 sm:translate-y-0"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-95 translate-y-4 sm:translate-y-0"
  >
    <div 
      v-if="showShortcutsModal" 
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="closeShortcutsModal"
    >
      <div 
        class="relative w-full max-w-sm rounded-xl p-6 shadow-2xl" 
        style="background: var(--surface-1); border: 1px solid var(--border); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);"
      >
        <div class="mb-5 flex justify-between items-start">
          <div>
            <h3 class="text-lg font-bold tracking-tight" style="color: var(--text-primary)">Keyboard Shortcuts</h3>
            <p class="text-sm mt-1" style="color: var(--text-secondary)">Speed up your workflow with these shortcuts.</p>
          </div>
          <button @click="closeShortcutsModal" class="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style="color: var(--text-muted)">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-3 mb-6">
          <div class="flex items-center justify-between p-3 rounded-lg" style="background: var(--surface-2); border: 1px solid var(--border)">
            <span class="text-sm font-medium" style="color: var(--text-primary)">Export Image</span>
            <div class="flex gap-1.5">
              <kbd class="px-2 py-1 text-xs font-sans font-medium rounded-md" style="background: var(--surface-0); border: 1px solid var(--border); color: var(--text-primary); box-shadow: 0 2px 0 var(--border)">Ctrl/Cmd</kbd>
              <kbd class="px-2 py-1 text-xs font-sans font-medium rounded-md" style="background: var(--surface-0); border: 1px solid var(--border); color: var(--text-primary); box-shadow: 0 2px 0 var(--border)">E</kbd>
            </div>
          </div>
          <div class="flex items-center justify-between p-3 rounded-lg" style="background: var(--surface-2); border: 1px solid var(--border)">
            <span class="text-sm font-medium" style="color: var(--text-primary)">Save Settings</span>
            <div class="flex gap-1.5">
              <kbd class="px-2 py-1 text-xs font-sans font-medium rounded-md" style="background: var(--surface-0); border: 1px solid var(--border); color: var(--text-primary); box-shadow: 0 2px 0 var(--border)">Ctrl/Cmd</kbd>
              <kbd class="px-2 py-1 text-xs font-sans font-medium rounded-md" style="background: var(--surface-0); border: 1px solid var(--border); color: var(--text-primary); box-shadow: 0 2px 0 var(--border)">S</kbd>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between mt-2 pt-4" style="border-top: 1px solid var(--border)">
          <label class="flex items-center gap-2 cursor-pointer text-sm" style="color: var(--text-secondary)">
            <input 
              type="checkbox" 
              v-model="neverShowShortcutsAgain" 
              class="rounded w-4 h-4 cursor-pointer focus:ring-[var(--accent)] focus:ring-offset-0 transition-colors"
              style="background: var(--surface-2); border: 1px solid var(--border); color: var(--accent);"
            >
            <span class="select-none cursor-pointer">Don't show this again</span>
          </label>
        </div>
      </div>
    </div>
  </Transition>

  <Toaster closeButton position="top-right" theme="dark" richColors />
</template>
