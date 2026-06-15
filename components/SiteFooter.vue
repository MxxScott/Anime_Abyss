<template>
  <footer>
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="#" class="logo">Anime Abyss</a>
        <p class="footer-desc">
          The deepest dive into the world of anime. Discover, track, and share your journey
          through thousands of titles.
        </p>
      </div>
      <div v-for="col in columns" :key="col.title" class="footer-col">
        <h4>{{ col.title }}</h4>
        <ul>
          <li v-for="link in col.links" :key="link"><a href="#">{{ link }}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Anime Abyss. All rights reserved.</span>
      <span class="footer-jp">深淵に飛び込め</span>
      <span>Privacy · Terms · Contact</span>
    </div>
  </footer>
</template>

<script setup>
const columns = [
  { title: 'Discover', links: ['Trending', 'Top Rated', 'Seasonal', 'New Releases', 'Classics'] },
  { title: 'Community', links: ['Forums', 'Reviews', 'Lists', 'Events'] },
  { title: 'Account', links: ['Sign Up', 'Login', 'My List', 'Settings'] },
]
</script>
