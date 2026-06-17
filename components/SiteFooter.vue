<template>
  <footer>
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="#top" class="logo" @click.prevent="toTop">Anime Abyss</a>
        <p class="footer-desc">
          The deepest dive into the world of anime. Discover, track, and share your journey
          through thousands of titles.
        </p>
      </div>

      <div v-for="col in columns" :key="col.title" class="footer-col">
        <h4>{{ col.title }}</h4>
        <ul>
          <li v-for="item in col.links" :key="item.label">
            <a v-if="item.href" :href="item.href" :target="item.ext ? '_blank' : null" rel="noopener">{{ item.label }}</a>
            <button v-else class="footer-link" @click="item.action">{{ item.label }}</button>
          </li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Account</h4>
        <ul>
          <ClientOnly>
            <template v-if="isLoaded && !isSignedIn">
              <li><SignUpButton mode="modal"><button class="footer-link">Sign Up</button></SignUpButton></li>
              <li><SignInButton mode="modal"><button class="footer-link">Login</button></SignInButton></li>
            </template>
            <template v-else-if="isLoaded && isSignedIn">
              <li><button class="footer-link" @click="manage">Manage Account</button></li>
              <li><button class="footer-link" @click="manage">Settings</button></li>
            </template>
          </ClientOnly>
          <li><button class="footer-link" @click="myList.open()">My List</button></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© 2026 Anime Abyss. All rights reserved.</span>
      <span class="footer-jp">深淵に飛び込め</span>
      <span class="footer-legal">
        <button class="footer-link" @click="toast.show('Privacy policy coming soon ✦')">Privacy</button>
        <span aria-hidden="true">·</span>
        <button class="footer-link" @click="toast.show('Terms coming soon ✦')">Terms</button>
        <span aria-hidden="true">·</span>
        <a class="footer-link" href="mailto:dlawal979@gmail.com">Contact</a>
      </span>
    </div>
  </footer>
</template>

<script setup>
const browse = useBrowse()
const myList = useMyList()
const toast = useToast()
const clerk = useClerk()
const { isLoaded, isSignedIn } = useUser()
const cfg = useRuntimeConfig().public

const scrollTo = (sel) => {
  if (import.meta.client) document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' })
}
const toTop = () => { if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' }) }
const soon = (msg) => toast.show(msg)
const manage = () => clerk.value?.openUserProfile?.()

const columns = [
  {
    title: 'Discover',
    links: [
      { label: 'Trending', action: () => scrollTo('#trending') },
      { label: 'Top Rated', action: () => browse.open({ source: 'top', title: 'Top Rated' }) },
      { label: 'Seasonal', action: () => scrollTo('#seasonal') },
      { label: 'New Releases', action: () => browse.open({ source: 'top', filter: 'airing', title: 'Now Airing' }) },
      { label: 'Classics', action: () => browse.open({ source: 'top', filter: 'favorite', title: 'All-Time Favorites' }) },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'WhatsApp Community', href: cfg.whatsappUrl || '#', ext: !!cfg.whatsappUrl },
      { label: 'Telegram Channel', href: cfg.telegramUrl || '#', ext: !!cfg.telegramUrl },
      { label: 'My List', action: () => myList.open() },
      { label: 'Suggest a Title', action: () => soon('Suggestions coming soon ✦') },
    ],
  },
]
</script>
