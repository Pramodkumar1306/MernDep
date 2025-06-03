import React, { useState } from 'react';
import { Trash2, SortAsc, SortDesc, FileText } from 'lucide-react';
import { Expense } from '../types';

interface ExpenseTableProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onExportToPdf: () => void;
}

type SortField = 'date' | 'description' | 'amount' | 'paymentMode' | 'category';
type SortDirection = 'asc' | 'desc';

const ExpenseTable: React.FC<ExpenseTableProps> = ({ 
  expenses, 
  onDeleteExpense,
  onExportToPdf 
}) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <SortAsc className="w-4 h-4 inline-block" /> 
      : <SortDesc className="w-4 h-4 inline-block" />;
  };
  
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    if (sortField === 'amount') {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    
    const aValue = a[sortField].toString().toLowerCase();
    const bValue = b[sortField].toString().toLowerCase();
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
  
  // Format date to display in readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-600 mb-4">No expenses recorded yet. Add your first expense above.</p>
        <button 
          onClick={onExportToPdf}
          disabled
          className="bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
        >
          <FileText size={18} />
          <span>Export to PDF</span>
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Expense Records</h2>
        
        <button 
          onClick={onExportToPdf}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-300 flex items-center gap-2"
        >
          <FileText size={18} />
          <span>Export to PDF</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-700 bg-gray-50">
            <tr>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('date')}>
                Date {getSortIcon('date')}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('description')}>
                Description {getSortIcon('description')}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('amount')}>
                Amount (₹) {getSortIcon('amount')}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('paymentMode')}>
                Payment Mode {getSortIcon('paymentMode')}
              </th>
              <th className="px-4 py-3 cursor-pointer" onClick={() => handleSort('category')}>
                Category {getSortIcon('category')}
              </th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.map((expense) => (
              <tr 
                key={expense.id} 
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-3">{formatDate(expense.date)}</td>
                <td className="px-4 py-3">{expense.description}</td>
                <td className="px-4 py-3 font-medium">{expense.amount.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3">{expense.paymentMode}</td>
                <td className="px-4 py-3">
                  <span className="inline-block py-1 px-2.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {expense.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-gray-200 flex justify-end">
        <p className="text-lg font-semibold">
          Total: ₹{expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default ExpenseTable;