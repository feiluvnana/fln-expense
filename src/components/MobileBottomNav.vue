<script setup lang="ts">
import { t, type Locale } from '@/locales/i18n'
import AppIcon from '@/components/icons/AppIcon.vue'

defineProps<{
  currentView: 'dashboard' | 'all' | 'recurring'
  locale: Locale
}>()

const emit = defineEmits<{
  (e: 'navigate', view: 'dashboard' | 'all' | 'recurring'): void
  (e: 'open-add-modal'): void
  (e: 'open-data-modal'): void
}>()
</script>

<template>
  <nav class="mobile-bottom-nav" aria-label="Bottom Navigation">
    <button
      type="button"
      class="nav-tab"
      :class="{ active: currentView === 'dashboard' }"
      @click="emit('navigate', 'dashboard')"
    >
      <div class="icon-wrap">
        <AppIcon name="dashboard" :size="19" stroke-width="2" />
      </div>
      <span class="tab-label">{{ t('dashboard', locale) }}</span>
    </button>

    <button
      type="button"
      class="nav-tab"
      :class="{ active: currentView === 'recurring' }"
      @click="emit('navigate', 'recurring')"
    >
      <div class="icon-wrap">
        <AppIcon name="repeat" :size="19" stroke-width="2" />
      </div>
      <span class="tab-label">{{ t('recurring', locale) }}</span>
    </button>

    <!-- Center Thumb Quick-Add FAB -->
    <div class="fab-slot">
      <button
        type="button"
        class="center-fab"
        :aria-label="t('addTx', locale)"
        @click="emit('open-add-modal')"
      >
        <AppIcon name="plus" :size="22" stroke-width="2.6" />
      </button>
    </div>

    <button
      type="button"
      class="nav-tab"
      :class="{ active: currentView === 'all' }"
      @click="emit('navigate', 'all')"
    >
      <div class="icon-wrap">
        <AppIcon name="transactions" :size="19" stroke-width="2" />
      </div>
      <span class="tab-label">{{ t('allTransactions', locale) }}</span>
    </button>

    <button
      type="button"
      class="nav-tab"
      :aria-label="t('dataManagement', locale)"
      @click="emit('open-data-modal')"
    >
      <div class="icon-wrap">
        <AppIcon name="database" :size="19" stroke-width="2" />
      </div>
      <span class="tab-label">{{ t('navData', locale) }}</span>
    </button>
  </nav>
</template>

<style scoped>
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0.35rem 0.5rem calc(0.5rem + env(safe-area-inset-bottom, 0px));
  z-index: 50;
  box-shadow: 0 -4px 16px rgba(40, 33, 29, 0.06);
}

@media (min-width: 860px) {
  .mobile-bottom-nav {
    display: none;
  }
}

.nav-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  background: transparent;
  border: none;
  padding: 0.35rem 0.25rem;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    color 0.15s ease,
    transform 0.1s ease;
  min-height: 48px;
  justify-content: center;
  min-width: 0;
}

.nav-tab:active {
  transform: scale(0.96);
}

.nav-tab.active {
  color: var(--primary);
  font-weight: 600;
}

.nav-tab.active .icon-wrap {
  background: var(--primary-light);
  border-radius: var(--radius-pill);
}

.icon-wrap {
  width: 32px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.tab-label {
  font-size: 0.72rem;
  letter-spacing: -0.01em;
}

/* Elevated Center FAB */
.fab-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.5rem;
}

.center-fab {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-pill);
  background: linear-gradient(135deg, #e87b3a 0%, #df6826 100%);
  color: #ffffff;
  border: 3px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-float);
  cursor: pointer;
  transform: translateY(-8px);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.center-fab:active {
  transform: translateY(-5px) scale(0.95);
}
</style>
