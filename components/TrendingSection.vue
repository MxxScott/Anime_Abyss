<template>
  <section id="trending">
    <SectionHeader
      label="— Now Trending"
      title="Top of the Abyss"
      badge
      :view-all="{ href: 'https://myanimelist.net/topanime.php', text: 'Full Rankings →' }"
    />

    <div class="trend-controls">
      <label>
        <span>Type</span>
        <select v-model="type" class="trend-select">
          <option value="">All</option>
          <option value="tv">TV</option>
          <option value="movie">Movie</option>
          <option value="ova">OVA</option>
          <option value="ona">ONA</option>
          <option value="special">Special</option>
        </select>
      </label>
      <label>
        <span>Rank by</span>
        <select v-model="filter" class="trend-select">
          <option value="">Top Rated</option>
          <option value="bypopularity">Popularity</option>
          <option value="airing">Airing</option>
          <option value="upcoming">Upcoming</option>
          <option value="favorite">Most Favorited</option>
        </select>
      </label>
    </div>

    <div v-if="status === 'loading'" class="sk-grid">
      <div v-for="n in 12" :key="n" class="skeleton sk-card" />
    </div>

    <div v-else-if="status === 'error'" class="api-error">
      <span class="err-icon">⚠</span>Could not load trending anime.
      <a href="https://myanimelist.net/topanime.php" target="_blank" rel="noopener" style="color:var(--neon)">
        View on MyAnimeList →
      </a>
    </div>

    <div v-else-if="!items.length" class="api-error">
      <span class="err-icon">🔍</span>No titles match those filters.
    </div>

    <div v-else class="anime-grid">
      <AnimeCard
        v-for="(a, i) in items"
        :key="a.mal_id ?? i"
        v-reveal="(i % 6) * 55"
        :anime="a"
        :rank="i + 1"
      />
    </div>
  </section>
</template>

<script setup>
const { jFetch } = useJikan()
const items = ref([])
const status = ref('loading') // loading | error | ok
const type = ref('tv')
const filter = ref('')

async function load() {
  status.value = 'loading'
  const params = new URLSearchParams({ limit: '12' })
  if (type.value) params.set('type', type.value)
  if (filter.value) params.set('filter', filter.value)
  try {
    const d = await jFetch(`/top/anime?${params.toString()}`)
    items.value = d.data || []
    status.value = 'ok'
  } catch {
    status.value = 'error'
  }
}

onMounted(load)
watch([type, filter], load)
</script>
