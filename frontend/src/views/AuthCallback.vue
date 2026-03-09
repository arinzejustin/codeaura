<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CheckIcon, XIcon } from 'lucide-vue-next'
import { useHead } from '@unhead/vue'
import { useAuthStore } from '../stores/auth'

interface ParsedUser {
  id: string
  login: string
  name: string | null
  avatarUrl: string
  email: string | null
}

type AuthStatus = 'processing' | 'success' | 'error'

useHead({
  title: 'Authenticating | CodeAura',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})


/**
 * Decodes a JWT access token and extracts user fields from its payload.
 * Returns null if the token is malformed.
 */
function parseJwtUser(token: string): Omit<ParsedUser, 'id'> & { id: string } | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) throw new Error('Malformed token')

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const payload = JSON.parse(json)
    const metadata = payload.user_metadata ?? payload.app_metadata ?? {}

    return {
      id: payload.sub ?? '',
      email: payload.email ?? null,
      login:
        metadata.user_name ??
        metadata.preferred_username ??
        payload.email?.split('@')[0] ??
        '',
      name: metadata.full_name ?? metadata.name ?? null,
      avatarUrl: metadata.avatar_url ?? metadata.picture ?? '',
    }
  } catch {
    return null
  }
}

/**
 * Resolves the best URLSearchParams from the current URL,
 * preferring the hash fragment when it contains an access_token.
 */
function resolveAuthParams(): URLSearchParams {
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  return hashParams.has('access_token')
    ? hashParams
    : new URLSearchParams(window.location.search)
}

const router = useRouter()
const auth = useAuthStore()

const status = ref<AuthStatus>('processing')
const errorMsg = ref('')
const ideSource = ref('')
const isExtensionAuth = ref(false)

const timeouts: ReturnType<typeof setTimeout>[] = []

function delayedRedirect(path: string, delay = 3000) {
  timeouts.push(setTimeout(() => router.push(path), delay))
}

function fail(message: string, redirectPath = '/') {
  status.value = 'error'
  errorMsg.value = message
  delayedRedirect(redirectPath)
}

onUnmounted(() => timeouts.forEach(clearTimeout))

onMounted(async () => {
  try {
    const params = resolveAuthParams()
    const accessToken = params.get('access_token')

    const authError = params.get('error') ?? params.get('auth_error')
    if (authError) {
      const desc = params.get('error_description') ?? 'Authentication error from provider'
      return fail(desc, `/?auth_error=${encodeURIComponent(authError)}`)
    }

    if (!accessToken) {
      return fail('Missing authentication data')
    }

    let user: ParsedUser

    const directId = params.get('user_id')
    if (directId) {
      user = {
        id: directId,
        login: params.get('user_name') ?? 'user',
        name: params.get('full_name'),
        avatarUrl: params.get('avatar_url') ?? '',
        email: params.get('email'),
      }
    } else {
      const parsed = parseJwtUser(accessToken)
      if (!parsed || !parsed.id) {
        return fail(parsed === null ? 'Failed to parse user data' : 'Invalid user data')
      }
      user = { ...parsed, login: parsed.login || 'user' }
    }

    auth.setUser(user, accessToken)

    const ideName = localStorage.getItem('codeaura-auth-source')
    if (ideName) {
      localStorage.removeItem('codeaura-auth-source')
      ideSource.value = ideName
      isExtensionAuth.value = true
      status.value = 'success'

      timeouts.push(
        setTimeout(() => {
          window.location.href = `${ideName}://codeaura.codeaura-${ideName}/auth?token=${encodeURIComponent(accessToken)}`
        }, 500)
      )
      return
    }

    status.value = 'success'
    delayedRedirect('/', 1000)
  } catch (err: any) {
    fail(err?.message ?? 'Authentication failed')
  }
})
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center" style="background: var(--surface-0)">
    <div class="text-center p-12 rounded-2xl max-w-[400px]"
      style="background: var(--surface-1); border: 1px solid var(--border)">
      <!-- Processing -->
      <template v-if="status === 'processing'">
        <div class="w-10 h-10 rounded-full border-[3px] mx-auto animate-spin"
          style="border-color: var(--border); border-top-color: var(--accent)" />
        <h2 class="text-xl font-semibold mt-4" style="color: var(--text-primary)">
          Signing you in…
        </h2>
        <p class="text-sm mt-2" style="color: var(--text-secondary)">
          Please wait while we complete authentication.
        </p>
      </template>

      <!-- Success -->
      <template v-else-if="status === 'success'">
        <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto bg-green-500/15 text-green-500">
          <CheckIcon class="size-7" />
        </div>
        <h2 class="text-xl font-semibold mt-4" style="color: var(--text-primary)">
          Authentication Successful!
        </h2>
        <p class="text-sm mt-2" style="color: var(--text-secondary)">
          <template v-if="isExtensionAuth">
            You can safely close this tab and return to {{ ideSource }}.
            Prompting to open {{ ideSource }}…
          </template>
          <template v-else>
            Redirecting to CodeAura…
          </template>
        </p>
      </template>

      <!-- Error -->
      <template v-else-if="status === 'error'">
        <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto bg-red-500/15 text-red-500">
          <XIcon class="size-7" />
        </div>
        <h2 class="text-xl font-semibold mt-4" style="color: var(--text-primary)">
          Authentication Failed
        </h2>
        <p class="text-sm mt-2" style="color: var(--text-secondary)">{{ errorMsg }}</p>
        <p class="text-xs mt-2" style="color: var(--text-subtle)">Redirecting…</p>
      </template>
    </div>
  </div>
</template>