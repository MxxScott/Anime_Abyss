<template>
  <Transition name="startup">
    <div v-if="visible" class="startup" role="status" aria-live="polite" aria-label="Loading Anime Abyss">
      <div class="startup-noise" aria-hidden="true" />
      <div class="startup-orbit startup-orbit-a" aria-hidden="true" />
      <div class="startup-orbit startup-orbit-b" aria-hidden="true" />
      <div class="startup-core" aria-hidden="true">
        <span />
        <span />
      </div>

      <div class="startup-copy">
        <p class="startup-kicker">Archive signal / 001</p>
        <p class="startup-title">Anime <strong>Abyss</strong></p>
        <p class="startup-status">{{ status }}</p>
        <div class="startup-progress" aria-hidden="true">
          <span :style="{ transform: `scaleX(${progress / 100})` }" />
        </div>
      </div>

      <button class="startup-skip" type="button" @click="finish">Skip intro <span>↗</span></button>
    </div>
  </Transition>
</template>

<script setup>
const visible = ref(true)
const progress = ref(0)
const status = ref('Tuning the signal')
let progressTimer
let finishTimer

const finish = () => {
  visible.value = false
  if (import.meta.client) document.body.style.overflow = ''
}

onMounted(() => {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  if (reduce) {
    finish()
    return
  }

  document.body.style.overflow = 'hidden'
  const phases = [
    [22, 'Tuning the signal'],
    [48, 'Mapping the archive'],
    [76, 'Opening the abyss'],
    [100, 'Signal locked'],
  ]
  let phase = 0
  progressTimer = window.setInterval(() => {
    progress.value = phases[phase][0]
    status.value = phases[phase][1]
    phase += 1
    if (phase >= phases.length) window.clearInterval(progressTimer)
  }, 420)
  finishTimer = window.setTimeout(finish, 2050)
})

onBeforeUnmount(() => {
  if (progressTimer) window.clearInterval(progressTimer)
  if (finishTimer) window.clearTimeout(finishTimer)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>
