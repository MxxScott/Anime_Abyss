# Anime Abyss

A dark, immersive anime discovery web app built with **Nuxt 4**, **Vue 3** and **Tailwind CSS** —
pulling live data from the [Jikan / MyAnimeList API](https://jikan.moe) and IMDb ratings via
[OMDb](https://www.omdbapi.com). Browse, search, and dive into thousands of titles inside a
WebGL-flavoured interface with a slide-out detail panel, a personal watch list that follows your
account, and a fully native-feeling mobile experience.

> アニメ・アビス — dive into the depths.

## Features

**Discover**
- **Live data** from Jikan v4 — trending, featured, current season (auto-detected) and genre sections, with rate-limit-aware retries.
- **Hover-to-expand search** with an animated typewriter placeholder that cycles real anime suggestions; opens a full search overlay on click.
- **Browse overlay** — paginated, in-app "view all" / genre browsing (no redirects off-site).
- **Random Dive** — jump to a random title in one tap.
- **3D cover carousel** — a draggable Three.js ring of top covers; click a cover to open it.

**Explore a title**
- **Slide-out detail panel** with synopsis, stats, genre chips, MyAnimeList score and **IMDb rating** (when an OMDb key is set).
- **Inline trailer** (privacy-friendly YouTube embed) and a **"Descend Deeper"** recommendations rail.

**Make it yours**
- **My List** — favourite any title; a slide-out drawer shows your collection plus a **"Your Abyss" taste dashboard** (top genres, counts).
- **Account sync** — signed in, your list follows your Clerk account (`unsafeMetadata`); signed out, it persists in `localStorage`. On sign-in the two are merged.
- **Shareable list** — generate a link that imports your picks for someone else.

**Accounts**
- **Clerk authentication** (`@clerk/nuxt`) — modal sign-in / sign-up, hosted account management, and an auth-aware nav (Login / Sign Up swap to your avatar when signed in).

**Experience**
- **Fully responsive** — the top nav collapses into a slide-in sidebar drawer, plus a thumb-reachable **glassmorphic bottom action dock** (Search · Dive · My List · Top) on phones.
- **Custom cursor + trailing glow** on desktop; auto-disabled on touch devices.
- **Scroll-reveal motion**, skeleton loaders and graceful error states throughout; honours `prefers-reduced-motion` and safe-area insets.

## Tech stack

`Nuxt 4` · `Vue 3` · `Tailwind CSS` · `Three.js` · `Clerk` · `Jikan / MyAnimeList API` · `OMDb` · deployed on `Netlify`

## Project structure

```
app.vue                    # NuxtLayout + NuxtPage shell
layouts/default.vue        # global chrome + all overlays/panels
pages/
  index.vue                # composes the page sections
  sign-in/[...slug].vue    # Clerk sign-in route
  sign-up/[...slug].vue    # Clerk sign-up route
composables/
  useJikan.ts              # Jikan API client (retry, search, full, random, recs)
  useOmdb.ts               # IMDb ratings via OMDb
  useAnimeDetail.ts        # slide-out detail panel state
  useFavourites.ts         # My List (localStorage + Clerk account sync)
  useMyList.ts  useSearch.ts  useBrowse.ts  useToast.ts
plugins/reveal.ts          # v-reveal scroll-reveal directive
components/
  SiteNav.vue  SiteFooter.vue  MobileDock.vue   # navigation + mobile dock
  HeroSection.vue  HeroVisual.vue  StarField.vue  CustomCursor.vue
  MarqueeBar.vue  SectionHeader.vue
  TrendingSection.vue  FeaturedSection.vue  GenresSection.vue  SeasonalSection.vue
  CoverCarousel.vue  NewsletterSection.vue  AnimeCard.vue
  AnimeDetailPanel.vue  SearchOverlay.vue  BrowseOverlay.vue
  MyListPanel.vue  MyListStats.vue  FavouritesSync.vue  Toast.vue
assets/css/tailwind.css    # global styles, animations + responsive layer
```

## Environment variables

Create a `.env` in the project root (it is git-ignored):

```dotenv
# Clerk auth — from https://dashboard.clerk.com  (also set these in your Netlify env)
NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxx
NUXT_CLERK_SECRET_KEY=sk_test_xxxxxxxx
NUXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NUXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_TELEMETRY_DISABLED=1

# Optional: IMDb ratings in the detail panel — free key from https://www.omdbapi.com/apikey.aspx
NUXT_PUBLIC_OMDB_API_KEY=

# Optional: footer community links
NUXT_PUBLIC_WHATSAPP_URL=
NUXT_PUBLIC_TELEGRAM_URL=
```

> Note: `@clerk/nuxt` reads the secret key as **`NUXT_CLERK_SECRET_KEY`** (not `CLERK_SECRET_KEY`). After editing `.env`, restart the dev server — environment changes don't hot-reload.

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

## Deployment

Deployed on **Netlify** with SSR (required for Clerk's server-side session verification). Add the
same Clerk variables (and any optional keys) to the Netlify environment.

## Notes

- Live sections fetch client-side on mount; without a connection they show error states while the rest of the page still renders.
- The hero and carousel use the bundled `three` dependency; if WebGL/three is unavailable, an animated CSS fallback is shown.
- Favourites use Clerk `unsafeMetadata`, which is appropriate for client-writable preferences like a watch list.

## License

[MIT](./LICENSE)
