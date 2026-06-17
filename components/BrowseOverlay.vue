<template>
  <div class="se-overlay" :class="{ open: isOpen }" @click.self="close">
    <div class="se-panel">
      <div class="br-head">
        <h2 class="br-title">{{ ctx?.title || 'Browse' }}</h2>
        <button class="se-close" aria-label="Close" @click="close">✕</button>
      </div>

      <div ref="bodyEl" class="se-body">
        <div v-if="status === 'loading'" class="anime-grid">
          <div v-for="n in 24" :key="n" class="skeleton sk-card" />
        </div>
        <div v-else-if="status === 'error'" class="api-error">
          <span class="err-icon">⚠</span>Could not load this list.
        </div>
        <div v-else-if="!items.length" class="se-hint">Nothing here.</div>

        <template v-else>
          <div class="anime-grid">
            <AnimeCard
              v-for="(a, i) in items"
              :key="a.mal_id ?? i"
              :anime="a"
              :rank="(page - 1) * 25 + i + 1"
            />
          </div>
          <div class="br-pager">
            <button class="br-page-btn" :disabled="page <= 1 || status === 'loading'" @click="go(page - 1)">← Prev</button>
            <span class="br-page">Page {{ page }}<template v-if="lastPage"> / {{ lastPage }}</template></span>
            <button class="br-page-btn" :disabled="!hasNext || status === 'loading'" @click="go(page + 1)">Next →</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
const { isOpen, ctx, close } = useBrowse()
const { jFetch } = useJikan()

const items = ref([])
const status = ref('loading') // loading | ok | empty | error
const page = ref(1)
const hasNext = ref(false)
const lastPage = ref(0)
const bodyEl = ref(null)

function urlFor(c, p) {
  if (c.source === 'season') return `/seasons/now?page=${p}`
  if (c.source === 'genre') return `/anime?genres=${c.genreId}&order_by=members&sort=desc&sfw=true&page=${p}`
  const f = c.filter ? `filter=${c.filter}&` : ''
  return `/top/anime?${f}page=${p}` // 'top'
}

async function load() {
  if (!ctx.value) return
  status.value = 'loading'
  try {
    const d = await jFetch(urlFor(ctx.value, page.value))
    items.value = d.data || []
    hasNext.value = !!d.pagination?.has_next_page
    lastPage.value = d.pagination?.last_visible_page || 0
    status.value = items.value.length ? 'ok' : 'empty'
  } catch {
    status.value = 'error'
  }
}

function go(p) {
  page.value = p
  load()
  bodyEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(ctx, () => { page.value = 1; if (ctx.value) load() })
watch(isOpen, (v) => { if (import.meta.client) document.body.style.overflow = v ? 'hidden' : '' })

const onKey = (e) => { if (e.key === 'Escape') close() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>
