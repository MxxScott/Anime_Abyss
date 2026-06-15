<template>
  <div class="mobile-nav">
    <button class="hamburger" :class="{ active: isOpen }" @click="toggleMenu" aria-label="Toggle menu">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <transition name="drawer">
      <div v-if="isOpen" class="drawer-overlay" @click="closeMenu" />
    </transition>

    <transition name="drawer-slide">
      <nav v-if="isOpen" class="drawer-menu">
        <a href="#trending" class="drawer-link" @click="closeMenu">Trending</a>
        <a href="#featured" class="drawer-link" @click="closeMenu">Featured</a>
        <a href="#genres" class="drawer-link" @click="closeMenu">Genres</a>
        <a href="#seasonal" class="drawer-link" @click="closeMenu">Seasonal</a>
        <a href="#" class="drawer-link drawer-cta" @click="closeMenu">Watch Now</a>
      </nav>
    </transition>
  </div>
</template>

<script setup>
const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}
</script>

<style scoped>
.mobile-nav {
  display: none;
  position: fixed;
  top: 18px;
  right: 20px;
  z-index: 101;
}

@media (max-width: 768px) {
  .mobile-nav {
    display: block;
  }
}

.hamburger {
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 0;
}

.hamburger span {
  width: 24px;
  height: 2px;
  background: var(--neon);
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 0, 10, 0.8);
  z-index: 102;
}

.drawer-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  max-width: 85vw;
  background: linear-gradient(135deg, var(--indigo), var(--deep));
  backdrop-filter: blur(24px);
  border-left: 1px solid var(--ghost);
  z-index: 103;
  display: flex;
  flex-direction: column;
  padding-top: 80px;
  padding-right: 24px;
  padding-left: 24px;
}

.drawer-link {
  color: var(--dim);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 16px 0;
  border-bottom: 1px solid rgba(168, 85, 247, 0.1);
  transition: color 0.3s;
}

.drawer-link:hover {
  color: var(--white);
}

.drawer-cta {
  margin-top: auto;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--pulse), var(--neon));
  padding: 12px 20px;
  border-radius: 2px;
  color: var(--white);
  border: none;
  text-align: center;
  border-bottom: none;
}

.drawer-cta:hover {
  box-shadow: 0 0 28px var(--glow);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.3s ease;
}

.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(-100%);
}
</style>
