// Thin client for the Jikan (MyAnimeList) v4 API with rate-limit aware retries.
const REQUEST_GAP = 400
let requestQueue: Promise<unknown> = Promise.resolve()
let lastRequestAt = 0

export function useJikan() {
  const BASE = 'https://api.jikan.moe/v4'
  const CURATED_IDS = [5114, 1535, 9253, 21, 16498, 11061, 40748, 52991, 42310, 38000, 223]
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

  function queuedRequest<T>(request: () => Promise<T>): Promise<T> {
    const run = requestQueue.then(async () => {
      const remaining = REQUEST_GAP - (Date.now() - lastRequestAt)
      if (remaining > 0) await wait(remaining)
      lastRequestAt = Date.now()
      return request()
    })

    // Keep a failed request from poisoning the queue for all later sections.
    requestQueue = run.catch(() => undefined)
    return run
  }

  async function jFetch<T = any>(path: string, tries = 3): Promise<T> {
    let lastErr: unknown
    for (let i = 0; i < tries; i++) {
      try {
        const res = await queuedRequest(() => fetch(`${BASE}${path}`))
        if (res.status === 429) {
          await wait(1800 * (i + 1)) // rate limited — back off and retry
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

  // Individual anime endpoints remain available when Jikan's ranked collection
  // endpoints are degraded. This keeps discovery usable without inventing data.
  async function getCuratedAnime(ids = CURATED_IDS): Promise<any[]> {
    const results: any[] = []
    for (const id of ids) {
      try {
        const d = await jFetch(`/anime/${id}`)
        if (d.data) results.push(d.data)
      } catch {
        // Continue so one unavailable title does not hide the rest.
      }
      await wait(250)
    }
    return results
  }

  return { BASE, wait, jFetch, searchAnime, getAnimeFull, randomAnime, getRecommendations, getCuratedAnime }
}
