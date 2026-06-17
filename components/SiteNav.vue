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
        <button class="nav-search nav-dive" :disabled="diving" aria-label="Random anime" @click="dive">
          🎲 <span class="nav-extra-label">{{ diving ? 'Diving…' : 'Dive' }}</span>
        </button>
      </li>
      <li>
        <button class="nav-search nav-mylist" aria-label="My List" @click="openMyList">
          ♥ <span class="nav-extra-label">My List</span>
          <span v-if="count" class="nav-badge">{{ count }}</span>
        </button>
      </li>
      <li class="nav-auth">
        <ClientOnly>
          <template v-if="isLoaded">
            <UserButton v-if="isSignedIn" :after-sign-out-url="'/'" />
            <template v-else>
              <SignInButton mode="modal">
                <button class="nav-search nav-login">Login</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button class="nav-cta nav-cta-btn">Sign Up</button>
              </SignUpButton>
            </template>
          </template>
        </ClientOnly>
      </li>
    </ul>
  </nav>

  <div class="nav-overlay" :class="{ show: open }" @click="close" />
</template>

<script setup>
const search = useSearch()
const myList = useMyList()
const { items } = useFavourites()
const { randomAnime } = useJikan()
const { open: openDetail } = useAnimeDetail()
const { isLoaded, isSignedIn } = useUser()
const count = computed(() => items.value.length)

const open = ref(false)
const diving = ref(false)
const close = () => { open.value = false }
const openSearch = () => { open.value = false; search.open() }
const openMyList = () => { open.value = false; myList.open() }

async function dive() {
  if (diving.value) return
  open.value = false
  diving.value = true
  try {
    const a = await randomAnime()
    if (a) openDetail(a)
  } catch { /* ignore */ } finally {
    diving.value = false
  }
}

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
