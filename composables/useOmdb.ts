// Optional IMDb ratings via OMDb (https://www.omdbapi.com). Set a free key in
// NUXT_PUBLIC_OMDB_API_KEY to enable; without it this no-ops and the UI shows
// only MyAnimeList data. Title-matching is best-effort (anime <-> IMDb differ).
export function useOmdb() {
  const key = (useRuntimeConfig().public.omdbApiKey as string) || ''
  const enabled = !!key

  async function lookup(title: string, type: string) {
    const url = `https://www.omdbapi.com/?apikey=${key}&t=${encodeURIComponent(title)}` +
      (type ? `&type=${type}` : '')
    const r = await fetch(url)
    const d = await r.json()
    return d?.Response === 'True' ? d : null
  }

  async function ratingByTitle(title: string): Promise<{ imdb: string; imdbId: string } | null> {
    if (!enabled || !title) return null
    try {
      const d = (await lookup(title, 'series')) || (await lookup(title, 'movie')) || (await lookup(title, ''))
      if (d && d.imdbRating && d.imdbRating !== 'N/A') {
        return { imdb: d.imdbRating, imdbId: d.imdbID }
      }
    } catch { /* network/parse — fall through to null */ }
    return null
  }

  return { enabled, ratingByTitle }
}
