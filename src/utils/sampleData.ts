import type { Transaction } from '@/types/transaction'
import type { RecurringItem } from '@/types/recurring'
import { deserializeTx } from '@/stores/transactionStorage'
import { deserializeRecurringItem } from '@/stores/recurringStore'

export const RAW_SAMPLE_DATA = [
  {
    id: "tx_seed_001",
    amount: { minorUnits: "35000000", currencyCode: "VND" },
    category: { type: "income", name: "salary_and_wages", subcategory: "base_salary" },
    timestamp: "2026-09-01T08:30:00.000Z",
    note: "Lương tháng 8 chuyển khoản"
  },
  {
    id: "tx_seed_002",
    amount: { minorUnits: "5000000", currencyCode: "VND" },
    category: { type: "income", name: "business_and_freelance", subcategory: "client_projects" },
    timestamp: "2026-09-01T15:00:00.000Z",
    note: "Dự án thiết kế website công ty A"
  },
  {
    id: "tx_seed_003",
    amount: { minorUnits: "1000000", currencyCode: "VND" },
    category: { type: "income", name: "debt_and_loans", subcategory: "debt_collection" },
    timestamp: "2026-09-02T10:15:00.000Z",
    note: "Bạn Tuấn trả nợ tiền mua hộ vé máy bay"
  },
  {
    id: "tx_seed_004",
    amount: { minorUnits: "2000000", currencyCode: "VND" },
    category: { type: "expense", name: "loans_and_debts", subcategory: "lending" },
    timestamp: "2026-09-02T11:00:00.000Z"
  },
  {
    id: "tx_seed_005",
    amount: { minorUnits: "1500000", currencyCode: "VND" },
    category: { type: "expense", name: "loans_and_debts", subcategory: "debt_repayment" },
    timestamp: "2026-09-02T14:30:00.000Z",
    note: "Trả góp điện thoại kỳ 3/6"
  },
  {
    id: "tx_seed_006",
    amount: { minorUnits: "320000", currencyCode: "VND" },
    category: { type: "expense", name: "pet_care", subcategory: "pet_food" },
    timestamp: "2026-09-02T16:45:00.000Z",
    note: "Hạt cá hồi dinh dưỡng cho Bé Dứa"
  },
  {
    id: "tx_seed_007",
    amount: { minorUnits: "180000", currencyCode: "VND" },
    category: { type: "expense", name: "pet_care", subcategory: "pet_supplies" },
    timestamp: "2026-09-02T17:20:00.000Z",
    note: "Cát vệ sinh hữu cơ đậu nành"
  },
  {
    id: "tx_seed_008",
    amount: { minorUnits: "450000", currencyCode: "VND" },
    category: { type: "expense", name: "food_and_dining", subcategory: "groceries" },
    timestamp: "2026-09-03T09:10:00.000Z",
    note: "Rau củ và thịt bò siêu thị WinMart"
  },
  {
    id: "tx_seed_009",
    amount: { minorUnits: "65000", currencyCode: "VND" },
    category: { type: "expense", name: "food_and_dining", subcategory: "coffee_tea" },
    timestamp: "2026-09-03T10:00:00.000Z",
    note: "Cà phê muối sáng cùng đồng nghiệp"
  },
  {
    id: "tx_seed_010",
    amount: { minorUnits: "100000", currencyCode: "VND" },
    category: { type: "expense", name: "transportation", subcategory: "fuel_gas" },
    timestamp: "2026-09-03T11:30:00.000Z",
    note: "Đổ đầy bình xăng xe máy"
  },
  {
    id: "tx_seed_011",
    amount: { minorUnits: "620000", currencyCode: "VND" },
    category: { type: "expense", name: "utilities", subcategory: "electricity" },
    timestamp: "2026-09-03T13:00:00.000Z",
    note: "Tiền điện sinh hoạt tháng 8"
  },
  {
    id: "tx_seed_012",
    amount: { minorUnits: "4500", currencyCode: "JPY" },
    category: { type: "expense", name: "shopping", subcategory: "clothing_shoes" },
    timestamp: "2026-09-01T19:00:00.000Z",
    note: "Áo sơ mi Uniqlo Ginza"
  },
  {
    id: "tx_seed_013",
    amount: { minorUnits: "1200", currencyCode: "JPY" },
    category: { type: "expense", name: "food_and_dining", subcategory: "restaurants" },
    timestamp: "2026-09-02T12:30:00.000Z",
    note: "Ramen trưa Shibuya"
  },
  {
    id: "tx_seed_014",
    amount: { minorUnits: "1599", currencyCode: "USD" },
    category: { type: "expense", name: "entertainment", subcategory: "movies_streaming" },
    timestamp: "2026-09-01T20:00:00.000Z",
    note: "Gói gia đình Netflix Premium"
  }
]

export function getSampleTransactions(): Transaction[] {
  return RAW_SAMPLE_DATA.map(deserializeTx).filter((x): x is Transaction => x !== null)
}

export const RAW_SAMPLE_RECURRING = [
  {
    id: "rec_seed_001",
    name: "Lương cố định công ty",
    type: "income",
    amount: { minorUnits: "35000000", currencyCode: "VND" },
    category: { type: "income", name: "salary_and_wages", subcategory: "base_salary" },
    frequency: "monthly",
    dueDay: 5,
    active: true,
    notes: "Chuyển khoản ngày 5 hàng tháng"
  },
  {
    id: "rec_seed_002",
    name: "Tiền thuê căn hộ / phòng trọ",
    type: "expense",
    amount: { minorUnits: "4500000", currencyCode: "VND" },
    category: { type: "expense", name: "housing", subcategory: "rent" },
    frequency: "monthly",
    dueDay: 1,
    active: true,
    notes: "Thanh toán đầu tháng"
  },
  {
    id: "rec_seed_003",
    name: "Internet Wifi cáp quang",
    type: "expense",
    amount: { minorUnits: "250000", currencyCode: "VND" },
    category: { type: "expense", name: "utilities", subcategory: "internet" },
    frequency: "monthly",
    dueDay: 15,
    active: true
  },
  {
    id: "rec_seed_004",
    name: "Gói xem phim Netflix / Spotify",
    type: "expense",
    amount: { minorUnits: "1599", currencyCode: "USD" },
    category: { type: "expense", name: "entertainment", subcategory: "movies_streaming" },
    frequency: "monthly",
    dueDay: 20,
    active: true
  },
  {
    id: "rec_seed_005",
    name: "Hạt & pate dinh dưỡng Bé Dứa",
    type: "expense",
    amount: { minorUnits: "500000", currencyCode: "VND" },
    category: { type: "expense", name: "pet_care", subcategory: "pet_food" },
    frequency: "monthly",
    dueDay: 10,
    active: true,
    notes: "Thức ăn ngon cho mèo cưng"
  },
  {
    id: "rec_seed_006",
    name: "Gói tập Gym / Yoga định kỳ",
    type: "expense",
    amount: { minorUnits: "600000", currencyCode: "VND" },
    category: { type: "expense", name: "healthcare", subcategory: "health_fitness" },
    frequency: "monthly",
    dueDay: 8,
    active: true
  }
]

export function getSampleRecurring(): RecurringItem[] {
  return RAW_SAMPLE_RECURRING.map(deserializeRecurringItem).filter((x): x is RecurringItem => x !== null)
}
