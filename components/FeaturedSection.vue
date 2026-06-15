<template>
  <section id="featured">
    <SectionHeader label="— Editor's Choice" title="Featured Titles" :view-all="{ href: '#', text: 'Browse All →' }" />

    <div v-if="status === 'loading'" class="featured-grid">
      <div class="skeleton feat-main" />
      <div v-for="n in 4" :key="n" class="skeleton" />
    </div>

    <div v-else-if="status === 'error'" class="api-error">
      <span class="err-icon">⚠</span>Could not load featured titles.
    </div>

    <div v-else class="featured-grid">
      <div
        v-for="(a, i) in items"
        :key="a.mal_id ?? i"
        v-reveal="i * 90"
        class="feat-card"
        :class="i === 0 ? 'feat-main' : 'feat-small'"
      >
        <img :src="img(a)" :alt="a.title" loading="lazy">
        <div class="feat-overlay" />
        <div class="feat-content">
          <span class="feat-tag">{{ tag(a) }}</span>
          <div class="feat-title">{{ a.title_english || a.title }}</div>
          <p class="feat-desc">{{ synopsis(a) }}</p>
          <div v-if="i === 0" class="feat-actions">
            <a :href="a.url" target="_blank" rel="noopener" class="btn-sm btn-sm-p">View on MAL</a>
            <a href="#" class="btn-sm btn-sm-g">Add to List</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { jFetch, wait } = useJikan()
const IDS = [5114, 1535, 23, 9253, 21]
const items = ref([])
const status = ref('loading')

const img = (a) => a.images?.webp?.large_image_url || a.images?.jpg?.large_image_url || ''
const tag = (a) => (a.score ? '★ ' + a.score.toFixed(1) : a.genres?.[0]?.name || 'Anime')
const synopsis = (a) => (a.synopsis || '').replace(/\[Written.*?\]/g, '').trim()

onMounted(async () => {
  try {
    const results = []
    for (const id of IDS) {
      try {
        const d = await jFetch(`/anime/${id}`)
        if (d.data) results.push(d.data)
      } catch { /* skip */ }
      await wait(400)
    }
    if (results.length < 2) throw new Error('too few')
    items.value = results
    status.value = 'ok'
  } catch {
    status.value = 'error'
  }
})
</script>
