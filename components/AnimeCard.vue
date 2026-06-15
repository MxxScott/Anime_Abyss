<template>
  <div class="anime-card">
    <img :src="img" :alt="anime.title" loading="lazy">
    <div class="card-grad" />
    <div class="card-glow" />
    <div class="card-body">
      <div class="card-rank">#{{ String(rank).padStart(2, '0') }}</div>
      <div class="card-title">{{ anime.title_english || anime.title }}</div>
      <div class="card-meta">
        <span class="card-score">★ {{ score }}</span>
        <span class="card-genre">{{ genre }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  anime: { type: Object, required: true },
  rank: { type: Number, required: true },
})
const img = computed(() =>
  props.anime.images?.webp?.large_image_url || props.anime.images?.jpg?.large_image_url || '')
const score = computed(() => (props.anime.score ? props.anime.score.toFixed(1) : 'N/A'))
const genre = computed(() =>
  props.anime.genres?.[0]?.name || props.anime.demographics?.[0]?.name || 'Anime')
</script>
