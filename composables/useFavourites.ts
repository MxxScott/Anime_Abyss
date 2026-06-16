// "My List" watchlist, persisted to localStorage. Stores a slimmed anime record.
const KEY = 'anime-abyss:favourites'

export function useFavourites() {
  const items = useState<any[]>('favourites', () => [])
  const hydrated = useState<boolean>('favourites-hydrated', () => false)

  if (import.meta.client && !hydrated.value) {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) items.value = JSON.parse(raw)
    } catch { /* ignore corrupt storage */ }
    hydrated.value = true
  }

  function persist() {
    if (import.meta.client) {
      try { localStorage.setItem(KEY, JSON.stringify(items.value)) } catch { /* quota */ }
    }
  }

  const slim = (a: any) => ({
    mal_id: a.mal_id,
    title: a.title,
    title_english: a.title_english,
    score: a.score,
    type: a.type,
    images: a.images,
  })

  const has = (id: number) => items.value.some((a) => a.mal_id === id)

  function toggle(anime: any) {
    if (!anime?.mal_id) return
    items.value = has(anime.mal_id)
      ? items.value.filter((a) => a.mal_id !== anime.mal_id)
      : [...items.value, slim(anime)]
    persist()
  }

  function remove(id: number) {
    items.value = items.value.filter((a) => a.mal_id !== id)
    persist()
  }

  return { items, has, toggle, remove }
}
