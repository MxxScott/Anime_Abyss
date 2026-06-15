<template>
  <section id="trending">
    <SectionHeader
      label="— Now Trending"
      title="Top of the Abyss"
      badge
      :view-all="{ href: 'https://myanimelist.net/topanime.php', text: 'Full Rankings →' }"
    />

    <div v-if="status === 'loading'" class="sk-grid">
      <div v-for="n in 8" :key="n" class="skeleton sk-card" />
    </div>

    <div v-else-if="status === 'error'" class="api-error">
      <span class="err-icon">⚠</span>Could not load trending anime.
      <a href="https://myanimelist.net/topanime.php" target="_blank" rel="noopener" style="color:var(--neon)">
        View on MyAnimeList →
      </a>
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
const status = ref('loading') // 'loading' | 'error' | 'ok'

onMounted(async () => {
  try {
    const d = await jFetch('/top/anime?limit=12&type=tv')
    items.value = d.data || []
    status.value = 'ok'
  } catch {
    status.value = 'error'
  }
})
</script>
