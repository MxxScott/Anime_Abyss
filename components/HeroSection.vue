<template>
  <section class="hero">
    <div class="hero-orb" />
    <HeroVisual />
    <p class="hero-eyebrow">深淵のアニメ — Dive Into The Depths</p>
    <h1><span class="l1">Anime</span><span class="l2">Abyss</span></h1>
    <p class="hero-sub">
      Descend into an infinite universe of stories. Discover legendary classics and
      cutting-edge titles that reshape the boundaries of animation.
    </p>
    <div class="hero-actions">
      <a href="#trending" class="btn-primary">Explore Library</a>
      <a href="#seasonal" class="btn-outline">Seasonal Picks</a>
    </div>
    <div class="hero-stats">
      <div v-for="s in stats" :key="s.label">
        <div class="stat-num">{{ s.num }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
const stats = [
  { num: '12K+', label: 'Titles' },
  { num: '40+', label: 'Genres' },
  { num: '2M+', label: 'Members' },
]
</script>
