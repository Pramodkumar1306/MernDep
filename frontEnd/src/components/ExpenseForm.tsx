import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle } from 'lucide-react';
import { Expense, ExpenseFormData } from '../types';

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
}

const initialFormData: ExpenseFormData = {
  date: new Date().toISOString().split('T')[0],
  description: '',
  amount: '',
  paymentMode: 'Cash',
  category: ''
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [formData, setFormData] = useState<ExpenseFormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.date || !formData.description || !formData.amount || !formData.category) {
      setError('All fields are required');
      return;
    }
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    // Create new expense
    const newExpense: Expense = {
      id: uuidv4(),
      date: formData.date,
      description: formData.description,
      amount: amount,
      paymentMode: formData.paymentMode,
      category: formData.category
    };
    
    onAddExpense(newExpense);
    setFormData(initialFormData);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Expense</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What was this expense for?"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Check">Check</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Salary, Petrol"
            list="categories"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <datalist id="categories">
            <option value="Salary" />
            <option value="Petrol" />
            <option value="Materials" />
            <option value="Food" />
            <option value="Tools" />
            <option value="Transport" />
            <option value="Utilities" />
            <option value="Other" />
          </datalist>
        </div>
        
        <div className="flex items-end">
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} />
            <span>Add Expense</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;