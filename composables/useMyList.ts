// Global open/close state for the "My List" favourites drawer.
export function useMyList() {
  const isOpen = useState<boolean>('mylist-open', () => false)
  const open = () => { isOpen.value = true }
  const close = () => { isOpen.value = false }
  return { isOpen, open, close }
}
