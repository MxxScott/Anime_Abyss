// Thin client for the Jikan (MyAnimeList) v4 API with rate-limit aware retries.
export function useJikan() {
  const BASE = 'https://api.jikan.moe/v4'
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

  async function jFetch<T = any>(path: string, tries = 3): Promise<T> {
    let lastErr: unknown
    for (let i = 0; i < tries; i++) {
      try {
        const res = await fetch(`${BASE}${path}`)
        if (res.status === 429) {
          await wait(1500 * (i + 1)) // rate limited — back off and retry
          continue
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return (await res.json()) as T
      } catch (e) {
        lastErr = e
        if (i === tries - 1) break
        await wait(800 * (i + 1))
      }
    }
    throw lastErr ?? new Error('Jikan request failed')
  }

  async function searchAnime(q: string, limit = 24): Promise<any[]> {
    if (!q || !q.trim()) return []
    const d = await jFetch(
      `/anime?q=${encodeURIComponent(q.trim())}&limit=${limit}&order_by=members&sort=desc&sfw=true`,
    )
    return d.data || []
  }

  async function getAnimeFull(id: number): Promise<any> {
    const d = await jFetch(`/anime/${id}/full`)
    return d.data
  }

  // A single random (SFW) anime — powers the "Random Dive" button.
  async function randomAnime(): Promise<any> {
    const d = await jFetch('/random/anime')
    return d.data
  }

  // Community recommendations for a title — returns the lightweight entries.
  async function getRecommendations(id: number, n = 8): Promise<any[]> {
    const d = await jFetch(`/anime/${id}/recommendations`)
    return (d.data || []).slice(0, n).map((r: any) => r.entry).filter(Boolean)
  }

  return { BASE, wait, jFetch, searchAnime, getAnimeFull, randomAnime, getRecommendations }
}
