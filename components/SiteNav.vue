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
      <li
        class="nav-searchbox"
        role="button"
        tabindex="0"
        aria-label="Search"
        @click="openSearch"
        @keydown.enter="openSearch"
      >
        <span class="nsb-icon" aria-hidden="true">🔍</span>
        <input class="nsb-input" type="text" :placeholder="placeholder" readonly tabindex="-1" aria-hidden="true" />
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
      <li>
        <ClientOnly>
          <button
            class="nav-search nav-theme"
            :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggle"
          >
            <span class="nav-theme-icon" aria-hidden="true">{{ theme === 'dark' ? '☀' : '☾' }}</span>
            <span class="nav-extra-label">{{ theme === 'dark' ? 'Light' : 'Dark' }}</span>
          </button>
        </ClientOnly>
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
const { theme, toggle } = useTheme()
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

// ── Typewriter placeholder: types a suggestion, deletes, types the next ──
const SUGGESTIONS = [
  'One Piece', 'Frieren', 'Attack on Titan', 'Jujutsu Kaisen',
  'Chainsaw Man', 'Demon Slayer', 'Solo Leveling', 'Spy x Family',
  'Vinland Saga', 'Mushoku Tensei', 'Cowboy Bebop', 'Steins;Gate',
]
const placeholder = ref('Search anime…')
let twTimer = null

onMounted(() => {
  if (!import.meta.client) return
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  if (reduce) { placeholder.value = 'Search anime…'; return }

  let i = 0, j = 0, deleting = false
  const tick = () => {
    const word = SUGGESTIONS[i]
    j += deleting ? -1 : 1
    placeholder.value = word.slice(0, j) + '▏'
    let delay = deleting ? 45 : 95
    if (!deleting && j >= word.length) { deleting = true; delay = 1500 }
    else if (deleting && j <= 0) { deleting = false; i = (i + 1) % SUGGESTIONS.length; delay = 400 }
    twTimer = setTimeout(tick, delay)
  }
  twTimer = setTimeout(tick, 700)
})
onBeforeUnmount(() => {
  if (twTimer) clearTimeout(twTimer)
  if (import.meta.client) document.body.style.overflow = ''
})

watch(open, (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
})
</script>
