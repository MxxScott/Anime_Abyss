<template>
  <nav>
    <a href="#" class="logo" @click="close">Anime Abyss<span>アニメ・アビス</span></a>

    <button
      class="nav-toggle"
      :class="{ open }"
      :aria-expanded="open"
      aria-label="Toggle menu"
      @click="open = !open"
    >
      <span /><span /><span />
    </button>

    <ul :class="{ open }">
      <li v-for="l in links" :key="l.href"><a :href="l.href" @click="close">{{ l.label }}</a></li>
      <li><a href="#" class="nav-cta" @click="close">Watch Now</a></li>
    </ul>
  </nav>

  <div class="nav-overlay" :class="{ show: open }" @click="close" />
</template>

<script setup>
const open = ref(false)
const close = () => { open.value = false }

const links = [
  { href: '#trending', label: 'Trending' },
  { href: '#featured', label: 'Featured' },
  { href: '#genres', label: 'Genres' },
  { href: '#seasonal', label: 'Seasonal' },
]

// lock body scroll while the drawer is open
watch(open, (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
})
onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>
