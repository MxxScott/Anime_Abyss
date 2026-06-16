<template>
  <div>
    <div class="ml-overlay" :class="{ show: isOpen }" @click="close" />

    <aside class="ml-panel" :class="{ open: isOpen }" role="dialog" aria-modal="true" :aria-hidden="!isOpen">
      <div class="ml-head">
        <h2 class="ml-title">My List <span>{{ items.length }}</span></h2>
        <button class="ad-close ml-close" aria-label="Close" @click="close">✕</button>
      </div>

      <div class="ml-body">
        <div v-if="!items.length" class="se-hint">
          No saved titles yet — tap the ♥ on any anime to add it here.
        </div>
        <div v-else class="anime-grid">
          <AnimeCard v-for="(a, i) in items" :key="a.mal_id ?? i" :anime="a" :rank="i + 1" />
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
const { isOpen, close } = useMyList()
const { items: favItems } = useFavourites()
const { current } = useAnimeDetail()

const items = computed(() => favItems.value)

// Opening a title from the list → close the list so the detail panel shows.
watch(current, (a) => { if (a && isOpen.value) close() })
watch(isOpen, (v) => { if (import.meta.client) document.body.style.overflow = v ? 'hidden' : '' })

const onKey = (e) => { if (e.key === 'Escape') close() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>
