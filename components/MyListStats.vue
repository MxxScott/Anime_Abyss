<template>
  <div class="mls">
    <p class="mls-title">Your Abyss</p>
    <div class="mls-tiles">
      <div class="mls-tile"><b>{{ count }}</b><span>Titles</span></div>
      <div class="mls-tile"><b>{{ avg }}</b><span>Avg score</span></div>
      <div class="mls-tile"><b>{{ totalEp || '—' }}</b><span>Episodes</span></div>
      <div class="mls-tile"><b>{{ hours ? hours + 'h' : '—' }}</b><span>Watch time</span></div>
    </div>

    <div v-if="topGenres.length" class="mls-genres">
      <p class="mls-sub">Top genres</p>
      <div v-for="g in topGenres" :key="g.name" class="mls-bar-row">
        <span class="mls-bar-name">{{ g.name }}</span>
        <span class="mls-bar-track"><span class="mls-bar-fill" :style="{ width: g.pct + '%' }" /></span>
        <span class="mls-bar-n">{{ g.n }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { items } = useFavourites()

const count = computed(() => items.value.length)
const scored = computed(() => items.value.filter((a) => a.score))
const avg = computed(() =>
  scored.value.length
    ? (scored.value.reduce((s, a) => s + a.score, 0) / scored.value.length).toFixed(2)
    : '—')
const totalEp = computed(() => items.value.reduce((s, a) => s + (a.episodes || 0), 0))
const hours = computed(() => Math.round((totalEp.value * 24) / 60)) // ~24 min/episode

const topGenres = computed(() => {
  const m = {}
  for (const a of items.value) for (const g of (a.genres || [])) m[g] = (m[g] || 0) + 1
  const arr = Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const max = arr.length ? arr[0][1] : 1
  return arr.map(([name, n]) => ({ name, n, pct: Math.round((n / max) * 100) }))
})
</script>
