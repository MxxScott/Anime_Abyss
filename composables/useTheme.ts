// Light / dark theme. Default = dark (the "abyss" look). Persists to localStorage
// and reflects onto <html data-theme>. A no-flash script in nuxt.config sets the
// attribute before paint; this composable keeps Vue state in sync and toggles it.
type Theme = 'dark' | 'light'
const KEY = 'anime-abyss:theme'

export function useTheme() {
  const theme = useState<Theme>('theme', () => 'dark')

  // Hydrate from what the no-flash script already applied (client only).
  if (import.meta.client) {
    const current = (document.documentElement.dataset.theme as Theme)
      || (localStorage.getItem(KEY) as Theme)
    if (current === 'light' || current === 'dark') theme.value = current
  }

  function apply(t: Theme) {
    if (!import.meta.client) return
    document.documentElement.dataset.theme = t
    try { localStorage.setItem(KEY, t) } catch { /* private mode */ }
  }
  function set(t: Theme) { theme.value = t; apply(t) }
  function toggle() { set(theme.value === 'dark' ? 'light' : 'dark') }

  return { theme, set, toggle }
}
