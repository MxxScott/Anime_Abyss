<template>
  <section id="carousel" class="cc-section">
    <div class="cc-head">
      <p class="section-label">— Enter the Abyss</p>
      <h2 class="section-title">Spin the Depths</h2>
      <p class="cc-hint">Drag to spin · click a cover to dive in</p>
    </div>
    <div ref="host" class="cc-stage" aria-hidden="true" />
  </section>
</template>

<script setup>
const { jFetch } = useJikan()
const { open } = useAnimeDetail()
const host = ref(null)
let cleanup = () => {}

onMounted(async () => {
  let list = []
  try { const d = await jFetch('/top/anime?limit=14'); list = d.data || [] } catch { /* offline */ }
  if (!list.length) return

  let THREE
  try { THREE = await import('three') } catch { return } // three not installed → skip silently
  const el = host.value
  if (!el) return

  let w = el.clientWidth || 800
  let h = el.clientHeight || 460

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
  camera.position.set(0, 0, 6.6)

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(w, h)
  el.appendChild(renderer.domElement)
  el.style.touchAction = 'pan-y' // allow vertical page scroll, horizontal drag spins

  const group = new THREE.Group()
  scene.add(group)

  const N = list.length
  const R = 5
  const loader = new THREE.TextureLoader()
  loader.crossOrigin = 'anonymous'
  const meshes = []

  list.forEach((a, i) => {
    const ang = (i / N) * Math.PI * 2
    const mat = new THREE.MeshBasicMaterial({
      color: 0x2d1b69, transparent: true, side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.15), mat)
    mesh.position.set(Math.sin(ang) * R, 0, Math.cos(ang) * R)
    mesh.rotation.y = ang // face outward
    mesh.userData.anime = a
    group.add(mesh)
    meshes.push(mesh)

    const url = a.images?.jpg?.image_url || a.images?.webp?.image_url
    if (url) {
      loader.load(
        url,
        (tex) => { tex.colorSpace = THREE.SRGBColorSpace; mat.map = tex; mat.color.set(0xffffff); mat.needsUpdate = true },
        undefined,
        () => { /* CORS / load failure → keep the tinted plane */ },
      )
    }
  })

  // Interaction
  let dragging = false, moved = false, lastX = 0
  const vel = 0.0024
  const px = (e) => (e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX ?? e.clientX)
  const onDown = (e) => { dragging = true; moved = false; lastX = px(e) }
  const onMove = (e) => {
    if (!dragging) return
    const x = px(e); const dx = x - lastX; lastX = x
    group.rotation.y += dx * 0.005
    if (Math.abs(dx) > 2) moved = true
  }
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  const onUp = (e) => {
    dragging = false
    if (moved) return
    const r = el.getBoundingClientRect()
    ndc.x = ((px(e) - r.left) / r.width) * 2 - 1
    ndc.y = -(((e.changedTouches?.[0]?.clientY ?? e.clientY) - r.top) / r.height) * 2 + 1
    ray.setFromCamera(ndc, camera)
    const hits = ray.intersectObjects(meshes)
    if (hits.length) open(hits[0].object.userData.anime)
  }
  const cv = renderer.domElement
  cv.addEventListener('pointerdown', onDown)
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)

  const tmp = new THREE.Vector3()
  let raf = 0
  const loop = () => {
    if (!dragging) group.rotation.y += vel
    for (const m of meshes) {
      m.getWorldPosition(tmp)
      const s = THREE.MathUtils.mapLinear(tmp.z, -R, R, 0.78, 1.18)
      m.scale.setScalar(s)
      m.material.opacity = THREE.MathUtils.mapLinear(tmp.z, -R, R, 0.28, 1)
    }
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
    cv.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    ro.disconnect()
    meshes.forEach((m) => { m.geometry.dispose(); m.material.map?.dispose(); m.material.dispose() })
    renderer.dispose()
    if (cv.parentNode === el) el.removeChild(cv)
  }
})

onBeforeUnmount(() => cleanup())
</script>
