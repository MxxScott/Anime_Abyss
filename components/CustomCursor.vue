<template>
  <div ref="glow" class="cursor-glow" aria-hidden="true" />
  <div ref="dot" class="cursor" />
  <div ref="ring" class="cursor-ring" />
</template>

<script setup>
const dot = ref(null)
const ring = ref(null)
const glow = ref(null)
let raf = 0
let mx = 0, my = 0, rx = 0, ry = 0, gx = 0, gy = 0

const HOVER = 'a,button,.anime-card,.feat-card,.genre-card,.season-item,.nl-btn,.s-tab'
const onMove = (e) => { mx = e.clientX; my = e.clientY }
const onOver = (e) => { if (e.target.closest?.(HOVER)) grow(true) }
const onOut = (e) => { if (e.target.closest?.(HOVER)) grow(false) }

function grow(big) {
  const r = ring.value
  if (r) {
    r.style.width = big ? '58px' : '36px'
    r.style.height = big ? '58px' : '36px'
    r.style.opacity = big ? '1' : '.6'
    r.style.borderColor = big ? 'var(--neon)' : 'var(--glow)'
  }
  if (glow.value) glow.value.style.opacity = big ? '.55' : '.32'
}

function tick() {
  if (dot.value) { dot.value.style.left = mx + 'px'; dot.value.style.top = my + 'px' }
  rx += (mx - rx) * 0.13
  ry += (my - ry) * 0.13
  if (ring.value) { ring.value.style.left = rx + 'px'; ring.value.style.top = ry + 'px' }
  gx += (mx - gx) * 0.07 // glow trails further behind
  gy += (my - gy) * 0.07
  if (glow.value) { glow.value.style.left = gx + 'px'; glow.value.style.top = gy + 'px' }
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  window.addEventListener('mousemove', onMove)
  document.addEventListener('mouseover', onOver)
  document.addEventListener('mouseout', onOut)
  tick()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('mousemove', onMove)
  document.removeEventListener('mouseover', onOver)
  document.removeEventListener('mouseout', onOut)
})
</script>
