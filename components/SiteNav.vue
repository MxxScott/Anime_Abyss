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
      <li>
        <button class="nav-search" aria-label="Search" @click="openSearch">🔍 <span class="nav-extra-label">Search</span></button>
      </li>
      <li v-for="l in links" :key="l.href"><a :href="l.href" @click="close">{{ l.label }}</a></li>
      <li>
        <button class="nav-search nav-mylist" aria-label="My List" @click="openMyList">
          ♥ <span class="nav-extra-label">My List</span>
          <span v-if="count" class="nav-badge">{{ count }}</span>
        </button>
      </li>
      <li><a href="#" class="nav-cta" @click="close">Watch Now</a></li>
    </ul>
  </nav>

  <div class="nav-overlay" :class="{ show: open }" @click="close" />
</template>

<script setup>
const search = useSearch()
const myList = useMyList()
const { items } = useFavourites()
const count = computed(() => items.value.length)

const open = ref(false)
const close = () => { open.value = false }
const openSearch = () => { open.value = false; search.open() }
const openMyList = () => { open.value = false; myList.open() }

const links = [
  { href: '#trending', label: 'Trending' },
  { href: '#featured', label: 'Featured' },
  { href: '#genres', label: 'Genres' },
  { href: '#seasonal', label: 'Seasonal' },
]

watch(open, (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
})
onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>
