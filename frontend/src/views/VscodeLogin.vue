<script setup lang="ts">
import { onMounted } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || ""

onMounted(() => {
  localStorage.setItem('codeaura-auth-source', 'vscode')

  window.location.href = `${API_URL}/auth/github`
})
</script>

<template>
  <div class="w-screen h-screen flex items-center justify-center p-4 bg-black text-white">
    <div class="text-center">
      <div class="w-8 h-8 rounded-full border-2 border-t-accent animate-spin mx-auto mb-4"></div>
      <p>Redirecting to GitHub for VS Code authentication...</p>
    </div>
  </div>
</template>
