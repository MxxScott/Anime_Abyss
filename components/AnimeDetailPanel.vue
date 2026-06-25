<template>
  <div>
    <div class="ad-overlay" :class="{ show: isOpen }" @click="close" />

    <aside class="ad-panel" :class="{ open: isOpen }" aria-label="Anime details" :aria-hidden="!isOpen">
      <button class="ad-close" aria-label="Close" @click="close">✕</button>

      <template v-if="current">
        <div class="ad-hero">
          <img v-if="img" :src="img" :alt="title" class="ad-img">
          <div class="ad-hero-grad" />
          <div class="ad-hero-body">
            <span class="ad-type">{{ current.type || data?.type || 'Anime' }}</span>
            <h2 class="ad-title">{{ title }}</h2>
            <p v-if="data?.title_japanese" class="ad-jp">{{ data.title_japanese }}</p>
          </div>
        </div>

        <div class="ad-content">
          <div class="ad-ratings">
            <div class="ad-rating">
              <span class="ad-r-num">★ {{ malScore }}</span>
              <span class="ad-r-label">MyAnimeList</span>
            </div>
            <div v-if="imdb" class="ad-rating">
              <span class="ad-r-num">★ {{ imdb }}</span>
              <span class="ad-r-label">IMDb</span>
            </div>
          </div>

          <div v-if="genres.length" class="ad-chips">
            <span v-for="g in genres" :key="g" class="ad-chip">{{ g }}</span>
          </div>

          <div class="ad-facts">
            <div v-if="data?.episodes"><b>{{ data.episodes }}</b><span>Episodes</span></div>
            <div v-if="data?.status"><b>{{ data.status }}</b><span>Status</span></div>
            <div v-if="studio"><b>{{ studio }}</b><span>Studio</span></div>
            <div v-if="year"><b>{{ year }}</b><span>Year</span></div>
          </div>

          <p v-if="synopsis" class="ad-synopsis">{{ synopsis }}</p>
          <p v-else-if="loading" class="ad-muted">Loading details…</p>

          <div class="ad-actions">
            <button class="ad-watch" @click="openWatch">{{ showWatch ? '▾ Where to watch' : '▶ Watch' }}</button>
            <button class="ad-fav" :class="{ on: fav }" @click="toggleFav">
              {{ fav ? '♥ In My List' : '♡ Add to List' }}
            </button>
          </div>

          <div v-if="showWatch" class="ad-watch-box">
            <p v-if="watchLoading" class="ad-watch-loading">Finding where to watch…</p>
            <template v-else-if="watchOpts">
              <div v-if="freeOpts.length" class="ad-watch-group">
                <p class="ad-watch-h">Free &amp; official</p>
                <a v-for="o in freeOpts" :key="o.url" :href="o.url" target="_blank" rel="noopener" class="ad-watch-link free">{{ o.name }}<span class="arr" aria-hidden="true">↗</span></a>
              </div>
              <div v-if="watchOpts.youtube && watchOpts.youtube.length" class="ad-watch-group">
                <p class="ad-watch-h">Free on YouTube · official channels</p>
                <a v-for="o in watchOpts.youtube" :key="o.url" :href="o.url" target="_blank" rel="noopener" class="ad-watch-link free">{{ o.name }}<span class="arr" aria-hidden="true">↗</span></a>
              </div>
              <div v-if="paidOpts.length" class="ad-watch-group">
                <p class="ad-watch-h">More platforms</p>
                <a v-for="o in paidOpts" :key="o.url" :href="o.url" target="_blank" rel="noopener" class="ad-watch-link">{{ o.name }}<span class="arr" aria-hidden="true">↗</span></a>
              </div>
              <a v-if="watchOpts.justwatch" :href="watchOpts.justwatch.url" target="_blank" rel="noopener" class="ad-watch-all">Find it anywhere on JustWatch <span aria-hidden="true">↗</span></a>
              <p class="ad-watch-note">Official, legal sources only · availability varies by region.</p>
            </template>
          </div>

          <!-- Trailer -->
          <div v-if="trailerId" class="ad-trailer">
            <button v-if="!showTrailer" class="ad-trailer-btn" @click="showTrailer = true">▶ Watch Trailer</button>
            <div v-else class="ad-trailer-frame">
              <iframe
                :src="`https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&rel=0`"
                title="Trailer" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen
              />
            </div>
          </div>

          <!-- Recommendations -->
          <div v-if="recs.length" class="ad-recs">
            <p class="ad-recs-title">Descend Deeper</p>
            <div class="ad-recs-row">
              <button
                v-for="r in recs"
                :key="r.mal_id"
                class="ad-rec"
                :title="r.title"
                @click="open(r)"
              >
                <img :src="recImg(r)" :alt="r.title" loading="lazy">
                <span class="ad-rec-title">{{ r.title }}</span>
              </button>
            </div>
          </div>
        </div>
      </template>
    </aside>
  </div>
</template>

<script setup>
const { isOpen, current, close, open, pendingWatch } = useAnimeDetail()
const { getAnimeFull, getRecommendations } = useJikan()
const { enabled: omdbEnabled, ratingByTitle } = useOmdb()
const { has, toggle } = useFavourites()
const { buildOptions } = useWatch()

const data = ref(null)
const loading = ref(false)
const imdb = ref('')
const recs = ref([])
const showTrailer = ref(false)
const showWatch = ref(false)
const watchOpts = ref(null)
const watchLoading = ref(false)

const title = computed(() => current.value?.title_english || current.value?.title || '')
const img = computed(() =>
  data.value?.images?.webp?.large_image_url ||
  current.value?.images?.webp?.large_image_url ||
  current.value?.images?.jpg?.large_image_url || '')
const malScore = computed(() => {
  const s = data.value?.score ?? current.value?.score
  return s ? Number(s).toFixed(1) : 'N/A'
})
const genres = computed(() =>
  (data.value?.genres || current.value?.genres || []).map((g) => g.name).slice(0, 6))
const studio = computed(() => data.value?.studios?.[0]?.name || '')
const year = computed(() => data.value?.year || data.value?.aired?.prop?.from?.year || '')
const synopsis = computed(() => (data.value?.synopsis || '').replace(/\[Written.*?\]/g, '').trim())
const trailerId = computed(() => data.value?.trailer?.youtube_id || '')
const fav = computed(() => (current.value ? has(current.value.mal_id) : false))

const recImg = (r) => r.images?.webp?.image_url || r.images?.jpg?.image_url || ''
function toggleFav() { if (current.value) toggle(data.value || current.value) }

const freeOpts = computed(() => (watchOpts.value?.platforms || []).filter((o) => o.free))
const paidOpts = computed(() => (watchOpts.value?.platforms || []).filter((o) => !o.free))

async function openWatch() {
  showWatch.value = !showWatch.value
  if (showWatch.value && !watchOpts.value && current.value?.mal_id) {
    watchLoading.value = true
    try { watchOpts.value = await buildOptions(current.value.mal_id, title.value) }
    catch { watchOpts.value = { platforms: [], youtube: [], justwatch: null } }
    finally { watchLoading.value = false }
  }
}

watch(current, async (a) => {
  data.value = null
  imdb.value = ''
  recs.value = []
  showTrailer.value = false
  showWatch.value = false
  watchOpts.value = null
  if (!a?.mal_id) return
  loading.value = true
  try { data.value = await getAnimeFull(a.mal_id) } catch { /* keep list data */ }
  loading.value = false
  if (pendingWatch.value) { pendingWatch.value = false; openWatch() }
  getRecommendations(a.mal_id, 8).then((r) => { recs.value = r }).catch(() => {})
  if (omdbEnabled) {
    const t = data.value?.title_english || data.value?.title || a.title
    const r = await ratingByTitle(t)
    if (r) imdb.value = r.imdb
  }
})

const onKey = (e) => { if (e.key === 'Escape') close() }
watch(isOpen, (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
})
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>
