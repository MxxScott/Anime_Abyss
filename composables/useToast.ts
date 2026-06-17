// Tiny global toast for lightweight feedback (copied, coming-soon, etc.).
export function useToast() {
  const message = useState<string>('toast-msg', () => '')
  const visible = useState<boolean>('toast-visible', () => false)
  let t: any
  function show(msg: string) {
    message.value = msg
    visible.value = true
    if (import.meta.client) {
      clearTimeout(t)
      t = setTimeout(() => { visible.value = false }, 2200)
    }
  }
  return { message, visible, show }
}
