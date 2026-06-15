<template>
  <div class="marquee-wrap">
    <div class="marquee-track">
      <span v-for="(t, i) in doubled" :key="i" class="marquee-item">
        {{ t }}<span class="marquee-dot">✦</span>
      </span>
    </div>
  </div>
</template>

<script setup>
const titles = [
  'Fullmetal Alchemist: Brotherhood', 'Attack on Titan', 'Neon Genesis Evangelion',
  'Death Note', 'Cowboy Bebop', 'Steins;Gate', 'One Piece', 'Bleach TYBW',
  'Jujutsu Kaisen', 'Demon Slayer', 'Hunter x Hunter', 'Vinland Saga',
  'Frieren', 'Solo Leveling', 'Dungeon Meshi', 'Mushoku Tensei',
]
const doubled = [...titles, ...titles]
</script>
