<template>
  <div v-reveal class="section-header">
    <div>
      <p class="section-label">{{ label }}</p>
      <h2 class="section-title">{{ title }}</h2>
      <div v-if="badge" class="api-badge"><span class="api-dot" /> Live · Jikan / MyAnimeList</div>
    </div>
    <a v-if="viewAll" :href="viewAll.href" target="_blank" rel="noopener" class="view-all">
      {{ viewAll.text }}
    </a>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  title: { type: String, required: true },
  badge: { type: Boolean, default: false },
  viewAll: { type: Object, default: null }, // { href, text }
})
</script>
