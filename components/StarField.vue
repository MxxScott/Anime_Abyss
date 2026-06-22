<template>
  <canvas id="starfield" ref="cv" />
</template>

<script setup>
const cv = ref(null)
let ctx = null
let stars = []
let raf = 0

function init() {
  const c = cv.value
  if (!c) return
  c.width = window.innerWidth
  c.height = window.innerHeight
  stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    r: Math.random() * 1.4 + 0.2,
    o: Math.random() * 0.5 + 0.1,
    s: Math.random() * 0.3 + 0.05,
    t: Math.random() * Math.PI * 2,
  }))
}

function draw() {
  const c = cv.value
  if (!c || !ctx) return
  // Pink specks on dark; deeper violet on light so they stay visible.
  const light = document.documentElement.dataset.theme === 'light'
  const rgb = light ? '124, 58, 237' : '240, 171, 252'
  ctx.clearRect(0, 0, c.width, c.height)
  for (const s of stars) {
    s.t += s.s * 0.02
    const o = s.o * (0.5 + 0.5 * Math.sin(s.t))
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${rgb},${light ? o * 0.55 : o})`
    ctx.fill()
  }
  raf = requestAnimationFrame(draw)
}

onMounted(() => {
  ctx = cv.value.getContext('2d')
  init()
  draw()
  window.addEventListener('resize', init)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', init)
})
</script>
