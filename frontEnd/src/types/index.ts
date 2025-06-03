export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Check' | 'Other';
  category: string;
  siteName: string;
}

export interface ExpenseFormData {
  date: string;
  description: string;
  amount: string;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer' | 'Check' | 'Other';
  category: string;
  siteName: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface Site {
  name: string;
  id: string;
}