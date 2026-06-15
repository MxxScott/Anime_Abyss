// v-reveal — Framer-Motion-style scroll reveal (entry + exit) via IntersectionObserver.
// Registered universally so SSR can resolve the directive; the observer work runs
// only in `mounted`, which fires client-side.
//   v-reveal            (no delay)
//   v-reveal="120"      (120ms stagger)
//   v-reveal="{ delay: 120, once: true }"
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
      const opt = typeof binding.value === 'number' ? { delay: binding.value } : (binding.value || {})
      el.style.setProperty('--reveal-delay', `${opt.delay ?? 0}ms`)
      el.classList.add('reveal')

      const obs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              el.classList.add('reveal-in')
              if (opt.once) obs.unobserve(el)
            } else if (!opt.once) {
              el.classList.remove('reveal-in')
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      )
      obs.observe(el)
      ;(el as any)._revealObs = obs
    },
    unmounted(el: HTMLElement) {
      ;(el as any)._revealObs?.disconnect()
    },
  })
})
