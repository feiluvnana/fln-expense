<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Transaction } from '@/types/transaction'
import { type Locale, DEFAULT_LOCALE } from '@/locales/i18n'
import { useExpenseStore, type TxPayload } from '@/stores/expenseStore'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import MobileBottomNav from '@/components/MobileBottomNav.vue'
import TransactionModal from '@/components/TransactionModal.vue'
import DataManagementModal from '@/components/DataManagementModal.vue'
import DashboardView from '@/views/DashboardView.vue'
import AllTransactionsView from '@/views/AllTransactionsView.vue'
import RecurringView from '@/views/RecurringView.vue'

const LOCALE_KEY = 'fln_locale'
const locale = ref<Locale>(DEFAULT_LOCALE)
const currentView = ref<'dashboard' | 'all' | 'recurring'>('dashboard')
const isModalOpen = ref(false)
const isDataModalOpen = ref(false)
const editingTx = ref<Transaction | null>(null)

const store = useExpenseStore()

onMounted(() => {
  const saved = localStorage.getItem(LOCALE_KEY)
  if (saved === 'vi' || saved === 'ja') {
    locale.value = saved
  }
})

function changeLocale(loc: Locale) {
  locale.value = loc
  localStorage.setItem(LOCALE_KEY, loc)
}

function openAddModal() {
  editingTx.value = null
  isModalOpen.value = true
}

function openEditModal(tx: Transaction) {
  editingTx.value = tx
  isModalOpen.value = true
}

function handleSave(data: TxPayload, id?: string) {
  if (id) {
    store.updateTransaction(id, data)
  } else {
    store.addTransaction(data)
  }
}
</script>

<template>
  <div class="app-layout">
    <!-- Desktop Persistent Sidebar -->
    <AppSidebar
      :locale="locale"
      :current-view="currentView"
      @navigate="currentView = $event"
      @open-add-modal="openAddModal"
      @open-data-modal="isDataModalOpen = true"
      @change-locale="changeLocale"
    />

    <div class="app-body">
      <!-- Mobile Top Header with Logo & Quick Language Switch -->
      <AppHeader
        :locale="locale"
        @change-locale="changeLocale"
        @open-add-modal="openAddModal"
        @open-data-modal="isDataModalOpen = true"
      />

      <!-- Main Scrollable Content Area -->
      <main class="main-content">
        <Transition name="fade-slide" mode="out-in">
          <DashboardView
            v-if="currentView === 'dashboard'"
            :key="'dashboard-' + locale"
            :locale="locale"
            @navigate="currentView = $event"
            @edit="openEditModal"
            @delete="store.deleteTransaction"
            @open-add-modal="openAddModal"
            @open-data-modal="isDataModalOpen = true"
          />
          <RecurringView
            v-else-if="currentView === 'recurring'"
            :key="'recurring-' + locale"
            :locale="locale"
            @navigate="currentView = $event"
          />
          <AllTransactionsView
            v-else
            :key="'all-' + locale"
            :locale="locale"
            @navigate="currentView = $event"
            @edit="openEditModal"
            @delete="store.deleteTransaction"
            @open-add-modal="openAddModal"
          />
        </Transition>
      </main>

      <!-- Mobile Ergonomic Bottom Navigation Bar with Thumb Quick-Add FAB -->
      <MobileBottomNav
        :current-view="currentView"
        :locale="locale"
        @navigate="currentView = $event"
        @open-add-modal="openAddModal"
        @open-data-modal="isDataModalOpen = true"
      />
    </div>

    <!-- Transaction Bottom Sheet / Modal -->
    <TransactionModal
      :is-open="isModalOpen"
      :locale="locale"
      :editing-tx="editingTx"
      @close="isModalOpen = false"
      @save="handleSave"
    />

    <!-- Data Management / Import & Export Sheet Modal -->
    <DataManagementModal
      :is-open="isDataModalOpen"
      :locale="locale"
      @close="isDataModalOpen = false"
    />
  </div>
</template>

<style scoped>
.app-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
}

/* Smooth Page Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
