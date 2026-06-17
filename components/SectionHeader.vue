<template>
  <div v-reveal class="section-header">
    <div>
      <p class="section-label">{{ label }}</p>
      <h2 class="section-title">{{ title }}</h2>
      <div v-if="badge" class="api-badge"><span class="api-dot" /> Live · Jikan / MyAnimeList</div>
    </div>
    <button v-if="viewAll" class="view-all" @click="$emit('view-all')">{{ viewAll.text }}</button>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  title: { type: String, required: true },
  badge: { type: Boolean, default: false },
  viewAll: { type: Object, default: null }, // { text }
})
defineEmits(['view-all'])
</script>
