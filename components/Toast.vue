<template>
  <div class="toast" :class="{ show: visible }" role="status" aria-live="polite">{{ message }}</div>
</template>
<script setup>
const { message, visible } = useToast()
</script>
