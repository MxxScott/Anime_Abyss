<template>
  <div ref="host" class="hero-visual" aria-hidden="true" />
</template>

<script setup>
// Client-only Three.js scene: a wireframe "abyss portal" icosahedron wrapped in a
// particle halo, with subtle mouse parallax. Loaded from CDN so no install is
// it's bundled via `npm i three`; if it fails to load the CSS .hero-orb remains as fallback.
const host = ref(null)
let cleanup = () => {}

onMounted(async () => {
  let THREE
  try {
    THREE = await import('three')
  } catch {
    return // offline / blocked → keep the CSS orb fallback
  }
  const el = host.value
  if (!el) return

  let w = el.clientWidth || 480
  let h = el.clientHeight || 480

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
  camera.position.z = 4.2

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(w, h)
  el.appendChild(renderer.domElement)

  // Core: solid + wireframe icosahedron
  const geo = new THREE.IcosahedronGeometry(1.3, 1)
  const solid = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.12 }),
  )
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(geo),
    new THREE.LineBasicMaterial({ color: 0xe879f9, transparent: true, opacity: 0.85 }),
  )
  const core = new THREE.Group()
  core.add(solid, wire)
  scene.add(core)

  // Particle halo
  const N = 650
  const pos = new Float32Array(N * 3)
  for (let i = 0; i < N; i++) {
    const r = 2 + Math.random() * 1.7
    const t = Math.random() * Math.PI * 2
    const p = Math.acos(2 * Math.random() - 1)
    pos[i * 3] = r * Math.sin(p) * Math.cos(t)
    pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t)
    pos[i * 3 + 2] = r * Math.cos(p)
  }
  const pg = new THREE.BufferGeometry()
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const points = new THREE.Points(
    pg,
    new THREE.PointsMaterial({ color: 0xa855f7, size: 0.032, transparent: true, opacity: 0.7 }),
  )
  scene.add(points)

  // Mouse parallax
  let nx = 0, ny = 0
  const onMove = (e) => {
    nx = e.clientX / window.innerWidth - 0.5
    ny = e.clientY / window.innerHeight - 0.5
  }
  window.addEventListener('mousemove', onMove)

  let raf = 0
  const loop = () => {
    core.rotation.y += 0.004
    core.rotation.x += 0.0015
    points.rotation.y -= 0.0012
    camera.position.x += (nx * 0.7 - camera.position.x) * 0.05
    camera.position.y += (-ny * 0.7 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)
    raf = requestAnimationFrame(loop)
  }
  loop()

  const resize = () => {
    w = el.clientWidth; h = el.clientHeight
    if (!w || !h) return
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(el)

  cleanup = () => {
    cancelAnimationFrame(raf)
    window.removeEventListener('mousemove', onMove)
    ro.disconnect()
    geo.dispose(); pg.dispose()
    renderer.dispose()
    if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
  }
})

onBeforeUnmount(() => cleanup())
</script>
