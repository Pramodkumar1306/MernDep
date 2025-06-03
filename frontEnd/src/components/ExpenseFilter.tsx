import React from 'react';
import { DateRange } from '../types';
import { FilterX, Filter } from 'lucide-react';

interface ExpenseFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onClearFilter: () => void;
  isFiltered: boolean;
}

const ExpenseFilter: React.FC<ExpenseFilterProps> = ({ 
  dateRange, 
  onDateRangeChange, 
  onClearFilter,
  isFiltered
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDateRangeChange({
      ...dateRange,
      [name]: value
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Filter Expenses</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-4 space-x-3">
        {isFiltered && (
          <button
            onClick={onClearFilter}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md transition duration-300 flex items-center gap-2"
          >
            <FilterX size={18} />
            <span>Clear Filter</span>
          </button>
        )}
        
        <button
          onClick={() => onDateRangeChange(dateRange)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300 flex items-center gap-2"
        >
          <Filter size={18} />
          <span>Apply Filter</span>
        </button>
      </div>
    </div>
  );
};

export default ExpenseFilter;