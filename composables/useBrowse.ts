// Global state for the in-app Browse overlay (paginated catalogue, no MAL redirect).
// ctx: { source: 'top' | 'season' | 'genre', title: string, genreId?: number }
export function useBrowse() {
  const isOpen = useState<boolean>('browse-open', () => false)
  const ctx = useState<any | null>('browse-ctx', () => null)
  function open(c: any) { ctx.value = c; isOpen.value = true }
  function close() { isOpen.value = false }
  return { isOpen, ctx, open, close }
}
