// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@clerk/nuxt','@nuxtjs/tailwindcss', '@vercel/analytics'],
  runtimeConfig: {
    public: {
      // Optional: free key from https://www.omdbapi.com to show IMDb ratings.
      omdbApiKey: process.env.NUXT_PUBLIC_OMDB_API_KEY || '',
      whatsappUrl: process.env.NUXT_PUBLIC_WHATSAPP_URL || '',
      telegramUrl: process.env.NUXT_PUBLIC_TELEGRAM_URL || '',
    },
  },
  app: {
    head: {
      title: 'Anime Abyss',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        {
          name: 'description',
          content:
            'Descend into an infinite universe of anime — discover trending, featured, seasonal and classic titles. Live data from Jikan / MyAnimeList.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Noto+Serif+JP:wght@200;400;700&display=swap',
        },
      ],
    },
  },
})
