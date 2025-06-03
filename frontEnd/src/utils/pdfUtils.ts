import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Expense, DateRange } from '../types';

export const generatePdf = (expenses: Expense[], dateRange?: DateRange): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Contractor Expense Report', 14, 22);
  
  // Add date range if provided
  if (dateRange) {
    doc.setFontSize(12);
    doc.text(`Period: ${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`, 14, 30);
  }
  
  // Add timestamp
  const now = new Date();
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 14, 36);
  
  // Calculate total
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Expenses: ₹${total.toLocaleString('en-IN')}`, 14, 42);
  
  // Create table
  autoTable(doc, {
    startY: 50,
    head: [['Date', 'Description', 'Amount (₹)', 'Payment Mode', 'Category']],
    body: expenses.map(expense => [
      formatDate(expense.date),
      expense.description,
      expense.amount.toLocaleString('en-IN'),
      expense.paymentMode,
      expense.category
    ]),
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 50 }
  });
  
  // Save PDF
  doc.save('expense-report.pdf');
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};