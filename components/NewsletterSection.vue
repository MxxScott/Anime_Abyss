<template>
  <section id="newsletter">
    <p class="section-label">— Stay Connected</p>
    <h2 class="section-title">Never Miss an Episode</h2>
    <p style="text-align:center;color:var(--dim);font-size:1rem;font-weight:300;max-width:460px;margin:0 auto;line-height:1.7;">
      Get weekly updates on new releases, seasonal charts, and curated recommendations.
    </p>

    <form class="nl-form" @submit.prevent="subscribe">
      <input
        v-model="email"
        type="email"
        required
        class="nl-input"
        placeholder="your@email.com"
        :disabled="done"
      >
      <button class="nl-btn" type="submit">{{ done ? 'Subscribed ✓' : 'Subscribe' }}</button>
    </form>

    <p v-if="done" style="text-align:center;color:var(--neon);font-size:.8rem;margin-top:14px;letter-spacing:.1em;">
      You're on the list — welcome to the abyss.
    </p>
  </section>
</template>

<script setup>
const email = ref('')
const done = ref(false)
function subscribe() {
  if (!email.value) return
  // No backend yet — acknowledge locally. Wire to a real endpoint later.
  done.value = true
}
</script>
