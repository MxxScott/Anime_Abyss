// "My List" watchlist. Signed out → localStorage. Signed in → also synced to the
// user's Clerk unsafeMetadata so the list (and derived suggestions) follow the account.
const KEY = 'anime-abyss:favourites'

export function useFavourites() {
  const items = useState<any[]>('favourites', () => [])
  const hydrated = useState<boolean>('favourites-hydrated', () => false)
  const { isSignedIn, user } = useUser()

  if (import.meta.client && !hydrated.value) {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) items.value = JSON.parse(raw)
    } catch { /* ignore corrupt storage */ }
    hydrated.value = true
  }

  function persistLocal() {
    if (import.meta.client) {
      try { localStorage.setItem(KEY, JSON.stringify(items.value)) } catch { /* quota */ }
    }
  }
  function persistRemote() {
    if (import.meta.client && isSignedIn?.value && user?.value) {
      user.value
        .update({ unsafeMetadata: { ...(user.value.unsafeMetadata || {}), favourites: items.value } })
        .catch(() => { /* offline / rate-limited */ })
    }
  }
  function persist() { persistLocal(); persistRemote() }

  const slim = (a: any) => ({
    mal_id: a.mal_id,
    title: a.title,
    title_english: a.title_english,
    score: a.score ?? null,
    type: a.type,
    episodes: a.episodes ?? null,
    genres: (a.genres || []).map((g: any) => g.name),
    images: a.images,
  })

  const has = (id: number) => items.value.some((a) => a.mal_id === id)

  function add(anime: any) {
    if (!anime?.mal_id || has(anime.mal_id)) return
    items.value = [...items.value, slim(anime)]
    persist()
  }
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
  // Replace the whole list (local only) — used by the sign-in sync after merging.
  function setAll(arr: any[]) { items.value = arr; persistLocal() }

  return { items, has, add, toggle, remove, setAll }
}
