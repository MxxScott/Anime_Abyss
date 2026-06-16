// Global state for the slide-out detail panel: which anime is selected + open/closed.
export function useAnimeDetail() {
  const isOpen = useState<boolean>('detail-open', () => false)
  const current = useState<any | null>('detail-current', () => null)

  function open(anime: any) {
    current.value = anime
    isOpen.value = true
  }
  function close() {
    isOpen.value = false
  }
  return { isOpen, current, open, close }
}
