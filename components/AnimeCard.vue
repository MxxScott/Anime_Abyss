<template>
  <div class="anime-card" role="button" tabindex="0" @click="open(anime)" @keydown.enter="open(anime)">
    <img :src="img" :alt="anime.title" loading="lazy">
    <div class="card-grad" />
    <div class="card-glow" />
    <button
      class="card-fav"
      :class="{ on: fav }"
      :aria-label="fav ? 'Remove from My List' : 'Add to My List'"
      @click.stop="toggleFav"
    >{{ fav ? '♥' : '♡' }}</button>
    <button class="card-watch" aria-label="Watch" @click.stop="watchNow">
      <span class="cw-icon" aria-hidden="true">▶</span>
      <span class="cw-text">Watch</span>
    </button>
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
const { open } = useAnimeDetail()
const { has, toggle } = useFavourites()

const img = computed(() =>
  props.anime.images?.webp?.large_image_url || props.anime.images?.jpg?.large_image_url || '')
const score = computed(() => (props.anime.score ? props.anime.score.toFixed(1) : 'N/A'))
const genre = computed(() =>
  props.anime.genres?.[0]?.name || props.anime.demographics?.[0]?.name || 'Anime')
const fav = computed(() => has(props.anime.mal_id))
function toggleFav() { toggle(props.anime) }
function watchNow() { open(props.anime, { watch: true }) }
</script>
