<script setup lang="ts">
import { t, type Locale } from '@/locales/i18n'
import CatMascot from '@/components/CatMascot.vue'

import AppIcon from '@/components/icons/AppIcon.vue'

defineProps<{
  locale: Locale
}>()

const emit = defineEmits<{
  (e: 'change-locale', loc: Locale): void
  (e: 'open-add-modal'): void
  (e: 'open-data-modal'): void
}>()
</script>

<template>
  <header class="mobile-header">
    <div class="header-brand">
      <CatMascot :size="34" variant="avatar" />
      <div class="brand-text">
        <h1 class="brand-title">{{ t('appTitle', locale) }}</h1>
      </div>
    </div>

    <!-- Quick Language Switcher & Data Management on Mobile Top -->
    <div class="header-actions">
      <button
        type="button"
        class="btn-data-modal"
        :aria-label="t('dataManagement', locale)"
        :title="t('dataManagement', locale)"
        @click="emit('open-data-modal')"
      >
        <AppIcon name="database" :size="16" stroke-width="2.2" />
      </button>

      <div class="lang-toggle-pills">
        <button
          type="button"
          class="lang-pill"
          :class="{ active: locale === 'vi' }"
          @click="emit('change-locale', 'vi')"
        >
          VI
        </button>
        <button
          type="button"
          class="lang-pill"
          :class="{ active: locale === 'ja' }"
          @click="emit('change-locale', 'ja')"
        >
          JA
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgba(251, 248, 244, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 40;
}

@media (min-width: 860px) {
  .mobile-header {
    display: none;
  }
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}


.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-data-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-pill);
  background: var(--surface-warm);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-data-modal:hover {
  background: var(--surface-hover);
  color: var(--primary);
  border-color: var(--border-focus);
}

.lang-toggle-pills {
  display: flex;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  padding: 0.15rem;
  border-radius: var(--radius-pill);
  gap: 0.15rem;
}

.lang-pill {
  border: none;
  background: transparent;
  padding: 0.25rem 0.55rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: all 0.12s ease;
}

.lang-pill.active {
  background: #ffffff;
  color: var(--primary);
  box-shadow: 0 1px 3px rgba(58, 41, 30, 0.08);
}
</style>
