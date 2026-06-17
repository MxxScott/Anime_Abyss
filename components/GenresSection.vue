<template>
  <section id="genres">
    <SectionHeader label="— Browse by Genre" title="Explore the Depths" />
    <div class="genres-grid">
      <button
        v-for="(g, i) in genres"
        :key="g.name"
        v-reveal="(i % 5) * 45"
        class="genre-card"
        :style="{ '--gc': g.color }"
        @click="browse.open({ source: 'genre', genreId: g.id, title: g.name })"
      >
        <span class="genre-icon">{{ g.icon }}</span>
        <div class="genre-name">{{ g.name }}</div>
        <div class="genre-count">{{ g.count }} titles</div>
      </button>
    </div>
  </section>
</template>

<script setup>
const browse = useBrowse()
// id = Jikan genre/theme id (used for /anime?genres=ID)
const genres = [
  { icon: '⚔️', name: 'Action', count: '1,842', color: 'rgba(239,68,68,.2)', id: 1 },
  { icon: '✨', name: 'Fantasy', count: '2,104', color: 'rgba(124,58,237,.2)', id: 10 },
  { icon: '💀', name: 'Horror', count: '412', color: 'rgba(15,3,40,.5)', id: 14 },
  { icon: '❤️', name: 'Romance', count: '1,234', color: 'rgba(236,72,153,.2)', id: 22 },
  { icon: '🔬', name: 'Sci-Fi', count: '876', color: 'rgba(6,182,212,.2)', id: 24 },
  { icon: '😂', name: 'Comedy', count: '1,560', color: 'rgba(234,179,8,.2)', id: 4 },
  { icon: '🏫', name: 'School', count: '723', color: 'rgba(34,197,94,.2)', id: 23 },
  { icon: '🎌', name: 'Mecha', count: '445', color: 'rgba(249,115,22,.2)', id: 18 },
  { icon: '🌙', name: 'Isekai', count: '1,089', color: 'rgba(168,85,247,.2)', id: 62 },
  { icon: '🥷', name: 'Martial Arts', count: '331', color: 'rgba(239,68,68,.15)', id: 17 },
]
</script>
