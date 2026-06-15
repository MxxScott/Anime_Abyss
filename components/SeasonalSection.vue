<template>
  <section id="seasonal">
    <SectionHeader
      label="— Current Season"
      :title="heading"
      badge
      :view-all="{ href: 'https://myanimelist.net/anime/season', text: 'Full Schedule →' }"
    />

    <div class="s-tabs">
      <button
        v-for="t in tabs"
        :key="t.value"
        class="s-tab"
        :class="{ active: filter === t.value }"
        @click="filter = t.value"
      >
        {{ t.label }}
      </button>
    </div>

    <div v-if="status === 'loading'" class="seasonal-list">
      <div v-for="n in 4" :key="n" class="skeleton" style="height:106px;border-radius:4px;" />
    </div>

    <div v-else-if="status === 'error'" class="api-error">
      <span class="err-icon">⚠</span>Could not load seasonal data.
    </div>

    <div v-else-if="!filtered.length" class="api-error">
      <span class="err-icon">🔍</span>No {{ filter }} titles found this season.
    </div>

    <div v-else class="seasonal-list">
      <div
        v-for="(a, i) in filtered"
        :key="a.mal_id ?? i"
        v-reveal="(i % 6) * 50"
        class="season-item"
      >
        <div class="s-num">{{ String(i + 1).padStart(2, '0') }}</div>
        <img class="s-thumb" :src="thumb(a)" :alt="a.title" loading="lazy">
        <div class="s-info">
          <div class="s-title">{{ a.title_english || a.title }}</div>
          <div class="s-studio">{{ a.studios?.[0]?.name || 'Unknown Studio' }}</div>
          <div style="display:flex;gap:8px;align-items:center;margin-top:5px;">
            <span class="s-badge">{{ a.type || 'TV' }}</span>
            <span v-if="a.score" class="s-score">★ {{ a.score.toFixed(1) }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const { jFetch } = useJikan()
const tabs = [
  { value: 'all', label: 'All' },
  { value: 'TV', label: 'TV' },
  { value: 'Movie', label: 'Movies' },
  { value: 'ONA', label: 'ONA' },
]
const all = ref([])
const status = ref('loading')
const filter = ref('all')
const heading = ref('This Season')

const thumb = (a) => a.images?.webp?.image_url || a.images?.jpg?.image_url || ''
const filtered = computed(() => {
  const base = filter.value === 'all' ? all.value : all.value.filter((a) => a.type === filter.value)
  return base.slice(0, 10)
})

onMounted(async () => {
  try {
    const now = new Date()
    const yr = now.getFullYear()
    const map = ['winter','winter','spring','spring','spring','summer','summer','summer','fall','fall','fall','winter']
    const season = map[now.getMonth()]
    heading.value = season.charAt(0).toUpperCase() + season.slice(1) + ' ' + yr
    const d = await jFetch(`/seasons/${yr}/${season}`)
    all.value = (d.data || []).sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 20)
    status.value = 'ok'
  } catch {
    status.value = 'error'
  }
})
</script>
