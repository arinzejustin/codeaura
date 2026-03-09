<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CheckIcon, XIcon } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const status = ref<'processing' | 'success' | 'error'>('processing')
const errorMsg = ref('')

import { useHead } from '@unhead/vue'

useHead({
  title: 'Authenticating | CodeAura',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

onMounted(async () => {
  try {
    const hashStr = window.location.hash.substring(1)
    const hashParams = new URLSearchParams(hashStr)
    const searchParams = new URLSearchParams(window.location.search)

    const params = hashParams.has('access_token') ? hashParams : searchParams

    const accessToken = params.get('access_token')

    let userId = params.get('user_id')
    let userName = params.get('user_name')
    let fullName = params.get('full_name')
    let avatarUrl = params.get('avatar_url')
    let email = params.get('email')

    const authError = params.get('error') || params.get('auth_error')
    const authErrorDesc = params.get('error_description')

    if (authError) {
      status.value = 'error'
      errorMsg.value = authErrorDesc || 'Authentication error from provider'
      setTimeout(() => router.push(`/?auth_error=${authError}`), 3000)
      return
    }

    if (!accessToken) {
      status.value = 'error'
      errorMsg.value = 'Missing authentication data'
      setTimeout(() => router.push('/'), 3000)
      return
    }

    if (!userId) {
      try {
        const base64Url = accessToken.split('.')[1]
        if (!base64Url) {
          throw new Error('Invalid access token format')
        }
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload)

        userId = payload.sub || ''
        email = payload.email || ''
        const metadata = payload.user_metadata || payload.app_metadata || {}
        userName = metadata.user_name || metadata.preferred_username || email?.split('@')[0] || ''
        fullName = metadata.full_name || metadata.name || ''
        avatarUrl = metadata.avatar_url || metadata.picture || ''
      } catch (e) {
        console.error('Failed to parse access token', e)
        status.value = 'error'
        errorMsg.value = 'Failed to parse user data'
        setTimeout(() => router.push('/'), 3000)
        return
      }
    }

    if (!userId) {
      status.value = 'error'
      errorMsg.value = 'Invalid user data'
      setTimeout(() => router.push('/'), 3000)
      return
    }

    auth.setUser(
      {
        id: userId,
        login: userName || 'user',
        name: fullName || null,
        avatarUrl: avatarUrl || '',
        email: email || null,
      },
      accessToken
    )

    const isVscode = localStorage.getItem('codeaura-auth-source') === 'vscode'
    
    if (isVscode) {
      status.value = 'success'
      errorMsg.value = 'vs-code-success' // We'll use this to override the UI text
      localStorage.removeItem('codeaura-auth-source')
      window.location.href = `vscode://codeaura.codeaura-vscode/auth?token=${accessToken}`
      return
    }

    status.value = 'success'
    setTimeout(() => router.push('/'), 1000)
  } catch (err: any) {
    status.value = 'error'
    errorMsg.value = err.message || 'Authentication failed'
    setTimeout(() => router.push('/'), 3000)
  }
})
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center" style="background: var(--surface-0)">
    <div class="text-center p-12 rounded-2xl max-w-[400px]"
      style="background: var(--surface-1); border: 1px solid var(--border)">

      <template v-if="status === 'processing'">
        <div class="w-10 h-10 rounded-full border-[3px] mx-auto animate-spin"
          style="border-color: var(--border); border-top-color: var(--accent)" />
        <h2 class="text-xl font-semibold mt-4" style="color: var(--text-primary)">Signing you in...</h2>
        <p class="text-sm mt-2" style="color: var(--text-secondary)">Please wait while we complete authentication.</p>
      </template>

      <template v-if="status === 'success'">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto bg-green-500/15 text-green-500">
          <CheckIcon class="size-7" />
        </div>
        <h2 class="text-xl font-semibold mt-4" style="color: var(--text-primary)">Authentication Successful!</h2>
        <p v-if="errorMsg === 'vs-code-success'" class="text-sm mt-2" style="color: var(--text-secondary)">
          You can safely close this browser tab and return to VS Code. Prompting to open VS Code...
        </p>
        <p v-else class="text-sm mt-2" style="color: var(--text-secondary)">Redirecting to CodeAura...</p>
      </template>

      <template v-if="status === 'error'">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto bg-red-500/15 text-red-500">
          <XIcon class="size-7" />
        </div>
        <h2 class="text-xl font-semibold mt-4" style="color: var(--text-primary)">Authentication Failed</h2>
        <p class="text-sm mt-2" style="color: var(--text-secondary)">{{ errorMsg }}</p>
        <p class="text-xs mt-2" style="color: var(--text-subtle)">Redirecting...</p>
      </template>
    </div>
  </div>
</template>
