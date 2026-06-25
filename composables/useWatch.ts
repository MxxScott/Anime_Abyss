// Versatile "where to watch" — OFFICIAL / LEGAL sources only (no piracy).
// Pulls MyAnimeList/Jikan streaming links, flags free-tier platforms, and always
// offers free official-YouTube channels + a JustWatch fallback so it works for
// any title and never dead-ends.
const FREE = [
  'crunchyroll', 'tubi', 'pluto', 'retrocrush', 'plex', 'youtube',
  'ani-one', 'ani one', 'muse', 'freevee', 'bilibili', 'hoopla', 'kanopy',
]

export interface WatchOption { name: string; url: string; free: boolean }
export interface WatchOptions {
  platforms: WatchOption[]
  youtube: WatchOption[]
  justwatch: WatchOption | null
}

export function useWatch() {
  const { jFetch } = useJikan()
  const region = String(useRuntimeConfig().public.watchRegion || 'us').toLowerCase()

  const isFree = (name: string) => {
    const n = (name || '').toLowerCase()
    return FREE.some((f) => n.includes(f))
  }

  async function getStreaming(id: number): Promise<any[]> {
    try {
      const d = await jFetch<any>(`/anime/${id}/streaming`)
      return d.data || []
    } catch {
      return []
    }
  }

  function ytChannels(title: string): WatchOption[] {
    const q = (extra: string) =>
      `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${extra}`)}`
    return [
      { name: 'Muse Asia (YouTube)', url: q('Muse Asia full episode'), free: true },
      { name: 'Ani-One Asia (YouTube)', url: q('Ani-One full episode'), free: true },
    ]
  }

  function justwatch(title: string): WatchOption {
    return {
      name: 'JustWatch',
      url: `https://www.justwatch.com/${region}/search?q=${encodeURIComponent(title)}`,
      free: false,
    }
  }

  async function buildOptions(id: number, title: string): Promise<WatchOptions> {
    const raw = await getStreaming(id)
    const platforms: WatchOption[] = raw
      .filter((p) => p?.url)
      .map((p) => ({ name: p.name, url: p.url, free: isFree(p.name) }))
      .sort((a, b) => Number(b.free) - Number(a.free))
    return { platforms, youtube: ytChannels(title), justwatch: justwatch(title) }
  }

  return { isFree, getStreaming, buildOptions }
}
