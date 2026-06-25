// Global state for the slide-out detail panel: which anime is selected + open/closed.
export function useAnimeDetail() {
  const isOpen = useState<boolean>('detail-open', () => false)
  const current = useState<any | null>('detail-current', () => null)
  // when opened via a card's "Watch" button, auto-expand the where-to-watch list
  const pendingWatch = useState<boolean>('detail-pending-watch', () => false)

  function open(anime: any, opts: { watch?: boolean } = {}) {
    pendingWatch.value = !!opts.watch
    current.value = anime
    isOpen.value = true
  }
  function close() {
    isOpen.value = false
  }
  return { isOpen, current, pendingWatch, open, close }
}
