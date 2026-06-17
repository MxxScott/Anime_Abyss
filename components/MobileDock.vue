<template>
  <div class="mdock" role="navigation" aria-label="Quick actions">
    <button class="mdock-btn" @click="toTop" aria-label="Back to top">
      <span class="mdock-ico" aria-hidden="true">↑</span>
      <span class="mdock-lbl">Top</span>
    </button>
    <button class="mdock-btn" @click="search.open()" aria-label="Search">
      <span class="mdock-ico" aria-hidden="true">🔍</span>
      <span class="mdock-lbl">Search</span>
    </button>
    <button class="mdock-btn mdock-dive" :disabled="diving" @click="dive" aria-label="Random anime">
      <span class="mdock-ico" aria-hidden="true">🎲</span>
      <span class="mdock-lbl">{{ diving ? 'Diving' : 'Dive' }}</span>
    </button>
    <button class="mdock-btn" @click="myList.open()" aria-label="My list">
      <span class="mdock-ico" aria-hidden="true">♥<span v-if="count" class="mdock-badge">{{ count }}</span></span>
      <span class="mdock-lbl">List</span>
    </button>
  </div>
</template>

<script setup>
const search = useSearch()
const myList = useMyList()
const { items } = useFavourites()
const { randomAnime } = useJikan()
const { open: openDetail } = useAnimeDetail()

const count = computed(() => items.value.length)
const diving = ref(false)

const toTop = () => { if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' }) }

async function dive() {
  if (diving.value) return
  diving.value = true
  try {
    const a = await randomAnime()
    if (a) openDetail(a)
  } catch { /* ignore */ } finally {
    diving.value = false
  }
}
</script>
