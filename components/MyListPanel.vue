<template>
  <div>
    <div class="ml-overlay" :class="{ show: isOpen }" @click="close" />

    <aside class="ml-panel" :class="{ open: isOpen }" role="dialog" aria-modal="true" :aria-hidden="!isOpen">
      <div class="ml-head">
        <h2 class="ml-title">My List <span>{{ items.length }}</span></h2>
        <div class="ml-head-actions">
          <button v-if="items.length" class="ml-share" @click="share">{{ copied ? '✓ Copied' : '⤴ Share' }}</button>
          <button class="ad-close ml-close" aria-label="Close" @click="close">✕</button>
        </div>
      </div>

      <div class="ml-body">
        <div v-if="!items.length" class="se-hint">
          No saved titles yet — tap the ♥ on any anime to add it here.
        </div>
        <template v-else>
          <MyListStats />
          <div class="anime-grid">
            <AnimeCard v-for="(a, i) in items" :key="a.mal_id ?? i" :anime="a" :rank="i + 1" />
          </div>
        </template>
      </div>
    </aside>
  </div>
</template>

<script setup>
const { isOpen, close } = useMyList()
const { items: favItems, add } = useFavourites()
const { current } = useAnimeDetail()
const { getAnimeFull, wait } = useJikan()

const items = computed(() => favItems.value)
const copied = ref(false)

function shareUrl() {
  const ids = favItems.value.map((a) => a.mal_id).join(',')
  const base = window.location.origin + window.location.pathname
  return ids ? `${base}?list=${ids}` : base
}
async function share() {
  try {
    await navigator.clipboard.writeText(shareUrl())
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  } catch { /* clipboard blocked */ }
}

// Import a shared list from ?list=id1,id2,… on first load.
onMounted(async () => {
  const list = new URLSearchParams(window.location.search).get('list')
  if (!list) return
  const ids = list.split(',').map((n) => parseInt(n, 10)).filter(Boolean)
  for (const id of ids) {
    if (favItems.value.some((a) => a.mal_id === id)) continue
    try { const a = await getAnimeFull(id); if (a) add(a) } catch { /* skip */ }
    await wait(350) // respect Jikan rate limit
  }
})

watch(current, (a) => { if (a && isOpen.value) close() })
watch(isOpen, (v) => { if (import.meta.client) document.body.style.overflow = v ? 'hidden' : '' })

const onKey = (e) => { if (e.key === 'Escape') close() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>
