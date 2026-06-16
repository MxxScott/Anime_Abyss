// Global open/close state for the search overlay.
export function useSearch() {
  const isOpen = useState<boolean>('search-open', () => false)
  const open = () => { isOpen.value = true }
  const close = () => { isOpen.value = false }
  return { isOpen, open, close }
}
