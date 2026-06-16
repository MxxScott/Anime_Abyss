# Anime Abyss

A dark, immersive anime discovery landing page built with **Nuxt 4** and **Tailwind CSS**,
pulling live data from the [Jikan / MyAnimeList API](https://jikan.moe). Trending, featured,
seasonal and genre sections render in real time, wrapped in a WebGL hero, a custom cursor, and
scroll-reveal motion.

> アニメ・アビス — dive into the depths.

## Features

- **Live data** from Jikan v4 — top anime, current season (auto-detected), and curated featured titles, with rate-limit-aware retries.
- **Three.js hero visual** — a wireframe "abyss portal" with a particle halo and mouse parallax (graceful CSS fallback if WebGL/three is unavailable).
- **Custom cursor + trailing glow** on desktop; automatically disabled on touch / coarse-pointer devices.
- **Scroll-reveal animations** — staggered entry/exit transitions via IntersectionObserver, respecting `prefers-reduced-motion`.
- **Fully responsive** — the top nav collapses into a slide-in sidebar drawer on mobile.
- **Skeleton loaders** and graceful error states for every data section.

## Tech stack

`Nuxt 4` · `Vue 3` · `Tailwind CSS` · `Three.js` · `Jikan / MyAnimeList API`

## Project structure

```
app.vue                 # NuxtLayout + NuxtPage shell
layouts/default.vue     # global chrome: cursor, starfield, nav, footer
pages/index.vue         # composes the page sections
composables/useJikan.ts # Jikan API client (base URL + retry)
plugins/reveal.ts       # v-reveal scroll-reveal directive
components/
  CustomCursor.vue  StarField.vue  HeroVisual.vue
  SiteNav.vue  SiteFooter.vue  SectionHeader.vue  MarqueeBar.vue
  HeroSection.vue  AnimeCard.vue
  TrendingSection.vue  FeaturedSection.vue  GenresSection.vue
  SeasonalSection.vue  NewsletterSection.vue
assets/css/tailwind.css # global styles + animations
```

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Build for production:

```bash
npm run build
npm run preview
```

## Notes

- Data is fetched client-side on mount, so the live sections need an internet connection; without one they show error states and the rest of the page still renders.
- The hero uses the bundled `three` dependency; if it fails to load, the animated CSS orb stays as a fallback.

## License

MIT
