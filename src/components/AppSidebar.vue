<script setup lang="ts">
import { t, type Locale } from '@/locales/i18n'
import { formatDineroAmount } from '@/utils/dineroHelpers'
import { useExpenseStore } from '@/stores/expenseStore'
import CatMascot from '@/components/CatMascot.vue'
import AppIcon from '@/components/icons/AppIcon.vue'

defineProps<{
  locale: Locale
  currentView: 'dashboard' | 'all'
}>()

const emit = defineEmits<{
  (e: 'navigate', view: 'dashboard' | 'all'): void
  (e: 'open-add-modal'): void
  (e: 'open-data-modal'): void
  (e: 'change-locale', loc: Locale): void
}>()

const store = useExpenseStore()
</script>

<template>
  <aside class="desktop-sidebar">
    <!-- Brand Header -->
    <div class="sidebar-brand">
      <CatMascot :size="42" variant="avatar" />
      <div class="brand-info">
        <h2 class="sidebar-title">{{ t('appTitle', locale) }}</h2>
        <span class="sidebar-subtitle">{{ t('appSubtitle', locale) }}</span>
      </div>
    </div>

    <!-- Quick Add Button -->
    <button type="button" class="btn-primary btn-add-main" @click="emit('open-add-modal')">
      <AppIcon name="plus" :size="18" stroke-width="2.6" />
      <span>{{ t('addTx', locale) }}</span>
    </button>

    <!-- Navigation -->
    <nav class="sidebar-nav" aria-label="Main Navigation">
      <button
        type="button"
        class="nav-item"
        :class="{ active: currentView === 'dashboard' }"
        @click="emit('navigate', 'dashboard')"
      >
        <AppIcon name="dashboard" :size="19" stroke-width="2" />
        <span class="nav-text">{{ t('dashboard', locale) }}</span>
      </button>

      <button
        type="button"
        class="nav-item"
        :class="{ active: currentView === 'all' }"
        @click="emit('navigate', 'all')"
      >
        <AppIcon name="transactions" :size="19" stroke-width="2" />
        <span class="nav-text">{{ t('allTransactions', locale) }}</span>
      </button>
    </nav>

    <!-- Mini Balances Widget in Sidebar -->
    <div class="sidebar-balances">
      <div class="balances-header">
        <span class="balances-title">{{ t('currencyBalance', locale) }}</span>
      </div>
      <div class="balances-list">
        <div
          v-for="curr in store.activeCurrencies"
          :key="'side-' + curr"
          class="mini-balance-item"
        >
          <span class="mini-curr-tag">{{ curr }}</span>
          <span
            v-if="store.netBalanceByCurrency[curr]"
            class="mini-balance-val tabular-nums"
            :class="store.netBalanceByCurrency[curr]!.isNegative ? 'text-expense' : 'text-income'"
          >
            {{ formatDineroAmount(store.netBalanceByCurrency[curr]!.val, locale) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Footer Controls -->
    <div class="sidebar-footer">
      <button type="button" class="btn-sidebar-subtle" @click="emit('open-data-modal')">
        <AppIcon name="database" :size="16" stroke-width="2" />
        <span>{{ t('dataManagement', locale) }}</span>
      </button>

      <div class="lang-switch-container">
        <button
          type="button"
          class="lang-choice-btn"
          :class="{ active: locale === 'vi' }"
          @click="emit('change-locale', 'vi')"
        >
          Tiếng Việt
        </button>
        <button
          type="button"
          class="lang-choice-btn"
          :class="{ active: locale === 'ja' }"
          @click="emit('change-locale', 'ja')"
        >
          日本語
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.desktop-sidebar {
  display: none;
}

@media (min-width: 860px) {
  .desktop-sidebar {
    display: flex;
    flex-direction: column;
    width: 260px;
    height: 100vh;
    position: sticky;
    top: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 1.5rem 1.25rem;
    gap: 1.25rem;
    box-shadow: 2px 0 12px rgba(58, 41, 30, 0.03);
    z-index: 30;
  }
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.sidebar-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.btn-add-main {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.95rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

/* Nav */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  border-radius: var(--radius-md);
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.92rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
}

.nav-item:hover {
  background: var(--surface-warm);
  color: var(--text);
}

.nav-item.active {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(223, 104, 38, 0.1);
}

/* Sidebar Balances Widget */
.sidebar-balances {
  background: var(--surface-warm);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.balances-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.balances-title {
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.balances-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.mini-balance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
}

.mini-curr-tag {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  background: #ffffff;
  border: 1px solid var(--border);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  color: var(--text-secondary);
}

.mini-balance-val {
  font-weight: 600;
}

/* Footer */
.sidebar-footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

.btn-sidebar-subtle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--border);
  padding: 0.55rem 0.75rem;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.84rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-sidebar-subtle:hover {
  background: var(--surface-warm);
  color: var(--text);
  border-color: #d8cbbe;
}

.lang-switch-container {
  display: flex;
  background: var(--surface-warm);
  border: 1px solid var(--border);
  padding: 0.2rem;
  border-radius: var(--radius-pill);
  gap: 0.2rem;
}

.lang-choice-btn {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.35rem;
  border-radius: var(--radius-pill);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.lang-choice-btn.active {
  background: #ffffff;
  color: var(--text);
  box-shadow: 0 1px 3px rgba(58, 41, 30, 0.08);
}
</style>
