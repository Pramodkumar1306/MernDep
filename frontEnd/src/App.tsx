import React, { useState, useEffect } from 'react';
import { Expense, DateRange, Site } from './types';
import ExpenseForm from './components/ExpenseForm';
import ExpenseTable from './components/ExpenseTable';
import ExpenseFilter from './components/ExpenseFilter';
import SiteSelector from './components/SiteSelector';
import { generatePdf } from './utils/pdfUtils';
import { saveExpenses, loadExpenses, saveSites, loadSites } from './utils/storageUtils';
import { ReceiptIndianRupee as ReceiptIndian } from 'lucide-react';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });
  const [isFiltered, setIsFiltered] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  // Load sites and expenses from localStorage on component mount
  useEffect(() => {
    const loadedSites = loadSites();
    setSites(loadedSites);
    const loadedExpenses = loadExpenses();
    setExpenses(loadedExpenses);
    setFilteredExpenses(loadedExpenses);
  }, []);

  // Save sites to localStorage whenever they change
  useEffect(() => {
    saveSites(sites);
  }, [sites]);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    saveExpenses(expenses);
  }, [expenses]);

  const handleAddSite = (newSite: Site) => {
      const updatedSites = [...sites, newSite];
      setSites(updatedSites);
      saveSites(updatedSites);
  };

  const handleSiteSelect = (site: Site) => {
    setSelectedSite(site);
    const siteExpenses = expenses.filter(expense => expense.siteName === site.name);
    setFilteredExpenses(siteExpenses);
  };

  const handleAddExpense = (newExpense: Expense) => {
    const expenseWithSite = {
      ...newExpense,
      siteName: selectedSite?.name || ''
    };
    const updatedExpenses = [...expenses, expenseWithSite];
    setExpenses(updatedExpenses);
    
    if (isFiltered) {
      filterExpenses(dateRange, updatedExpenses);
    } else {
      setFilteredExpenses(updatedExpenses.filter(e => e.siteName === selectedSite?.name));
    }
  };

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    
    if (isFiltered) {
      filterExpenses(dateRange, updatedExpenses);
    } else {
      setFilteredExpenses(updatedExpenses.filter(e => e.siteName === selectedSite?.name));
    }
  };

  const filterExpenses = (range: DateRange, expenseList = expenses) => {
    if (!range.startDate && !range.endDate) {
      setIsFiltered(false);
      setFilteredExpenses(expenseList.filter(e => e.siteName === selectedSite?.name));
      return;
    }

    const filtered = expenseList.filter(expense => {
      if (expense.siteName !== selectedSite?.name) return false;
      
      const expenseDate = new Date(expense.date);
      let passesFilter = true;
      
      if (range.startDate) {
        const startDate = new Date(range.startDate);
        passesFilter = passesFilter && expenseDate >= startDate;
      }
      
      if (range.endDate) {
        const endDate = new Date(range.endDate);
        endDate.setHours(23, 59, 59, 999);
        passesFilter = passesFilter && expenseDate <= endDate;
      }
      
      return passesFilter;
    });
    
    setIsFiltered(true);
    setFilteredExpenses(filtered);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    filterExpenses(range);
  };

  const handleClearFilter = () => {
    setDateRange({ startDate: '', endDate: '' });
    setIsFiltered(false);
    setFilteredExpenses(expenses.filter(e => e.siteName === selectedSite?.name));
  };

  const handleExportToPdf = () => {
    generatePdf(filteredExpenses, isFiltered ? dateRange : undefined);
  };

  if (!selectedSite) {
    return (
      <SiteSelector
        onSiteSelect={handleSiteSelect}
        sites={sites}
        onAddSite={handleAddSite}
      />
    );
  }

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ReceiptIndian size={28} />
              <div>
                <h1 className="text-2xl font-bold">Contractor Expense Tracker</h1>
                <p className="text-sm opacity-90">Site: {selectedSite.name}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedSite(null)}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition duration-300"
            >
              Change Site
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-medium text-gray-600 mb-2">Total Expenses</h2>
            <p className="text-3xl font-bold text-blue-600">₹{totalAmount.toLocaleString('en-IN')}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-medium text-gray-600 mb-2">Total Entries</h2>
            <p className="text-3xl font-bold text-blue-600">{filteredExpenses.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
            <h2 className="text-lg font-medium text-gray-600 mb-2">Date Range</h2>
            <p className="text-lg font-semibold text-blue-600">
              {isFiltered 
                ? `${dateRange.startDate || 'Any'} to ${dateRange.endDate || 'Any'}`
                : 'All Time'}
            </p>
          </div>
        </div>

        <ExpenseForm onAddExpense={handleAddExpense} />
        
        <ExpenseFilter
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onClearFilter={handleClearFilter}
          isFiltered={isFiltered}
        />
        
        <ExpenseTable 
          expenses={filteredExpenses} 
          onDeleteExpense={handleDeleteExpense}
          onExportToPdf={handleExportToPdf}
        />
      </main>
      
      <footer className="bg-gray-800 text-gray-300 py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Contractor Expense Tracker</p>
        </div>
      </footer>
    </div>
  );
}

export default App;