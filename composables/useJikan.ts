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

  return { BASE, wait, jFetch }
}
