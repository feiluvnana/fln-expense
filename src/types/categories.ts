export type TransactionType = 'expense' | 'income'

export const CATEGORY_IDENTIFIERS: Record<TransactionType, Record<string, string[]>> = {
  expense: {
    food_and_dining: ['groceries', 'restaurants', 'coffee_tea', 'fast_food', 'delivery'],
    transportation: ['public_transit', 'fuel_gas', 'taxi_rideshare', 'parking', 'maintenance'],
    housing: ['rent', 'mortgage', 'repairs', 'furniture'],
    utilities: ['electricity', 'water', 'internet', 'mobile_phone', 'gas_heating'],
    entertainment: ['movies_streaming', 'games', 'concerts_events', 'hobbies_books'],
    shopping: ['clothing_shoes', 'electronics', 'home_kitchen', 'personal_care'],
    healthcare: ['doctor_clinic', 'pharmacy_medicine', 'dental', 'health_insurance'],
    education: ['courses_training', 'books_materials', 'tuition'],
    other_expense: ['bank_fees', 'taxes', 'donations', 'miscellaneous'],
  },
  income: {
    salary_and_wages: ['base_salary', 'bonus', 'overtime', 'commission'],
    business_and_freelance: ['client_projects', 'consulting', 'product_sales'],
    investments: ['dividends', 'interest', 'capital_gains', 'rental_income'],
    gifts_and_grants: ['family_friends', 'scholarship', 'government_support'],
    other_income: ['tax_refund', 'cashback_rewards', 'selling_items', 'miscellaneous'],
  },
}
