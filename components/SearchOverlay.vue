<template>
  <div class="se-overlay" :class="{ open: isOpen }" @click.self="close">
    <div class="se-panel">
      <div class="se-bar">
        <span class="se-icon">🔍</span>
        <input
          ref="inputEl"
          v-model="q"
          class="se-input"
          type="search"
          placeholder="Search anime…"
          @keydown.esc="close"
        >
        <button class="se-close" aria-label="Close" @click="close">✕</button>
      </div>

      <div class="se-body">
        <div v-if="status === 'loading'" class="anime-grid">
          <div v-for="n in 8" :key="n" class="skeleton sk-card" />
        </div>
        <div v-else-if="status === 'error'" class="api-error">
          <span class="err-icon">⚠</span>Search failed — try again.
        </div>
        <div v-else-if="status === 'empty'" class="se-hint">No results for “{{ lastQ }}”.</div>
        <div v-else-if="status === 'idle'" class="se-hint">Search thousands of titles by name.</div>
        <div v-else class="anime-grid">
          <AnimeCard v-for="(a, i) in results" :key="a.mal_id ?? i" :anime="a" :rank="i + 1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { isOpen, close } = useSearch()
const { searchAnime } = useJikan()
const { current } = useAnimeDetail()

const q = ref('')
const results = ref([])
const status = ref('idle') // idle | loading | results | empty | error
const lastQ = ref('')
const inputEl = ref(null)
let timer

watch(q, (val) => {
  clearTimeout(timer)
  if (!val.trim()) { status.value = 'idle'; results.value = []; return }
  timer = setTimeout(run, 450) // debounce
})

async function run() {
  const term = q.value.trim()
  if (!term) return
  status.value = 'loading'
  lastQ.value = term
  try {
    const data = await searchAnime(term, 24)
    results.value = data
    status.value = data.length ? 'results' : 'empty'
  } catch {
    status.value = 'error'
  }
}

// Opening an anime from a result → close search so the detail panel is visible.
watch(current, (a) => { if (a && isOpen.value) close() })

watch(isOpen, async (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
  if (v) { await nextTick(); inputEl.value?.focus() }
})

const onKey = (e) => { if (e.key === 'Escape') close() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>
