<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({
  titleTemplate: (title) => title ? `${title} | CodeAura` : 'CodeAura — Beautiful Code Screenshots',
  meta: [
    { name: 'description', content: 'Create stunning code screenshots with beautiful themes, custom backgrounds, and pixel-perfect export. Make your code stand out.' },
    { property: 'og:title', content: 'CodeAura — Beautiful Code Screenshots' },
    { property: 'og:description', content: 'Create stunning code screenshots with beautiful themes, custom backgrounds, and pixel-perfect export. Make your code stand out.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://codeaura.com' }, // Assuming codeaura.com
    { property: 'og:image', content: 'https://codeaura.com/og-image.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'CodeAura — Beautiful Code Screenshots' },
    { name: 'twitter:description', content: 'Create stunning code screenshots with beautiful themes, custom backgrounds, and pixel-perfect export.' }
  ]
})
</script>

<template>
    <router-view />
</template>
