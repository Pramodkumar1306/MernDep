import { Expense, Site } from '../types';

const EXPENSES_KEY = 'contractor-expenses';
const SITES_KEY = 'contractor-sites';

export const saveExpenses = (expenses: Expense[]): void => {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
};

export const loadExpenses = (): Expense[] => {
  const storedExpenses = localStorage.getItem(EXPENSES_KEY);
  if (!storedExpenses) return [];
  
  try {
    return JSON.parse(storedExpenses);
  } catch (error) {
    console.error('Failed to parse expenses from localStorage:', error);
    return [];
  }
};

export const saveSites = (sites: Site[]): void => {
  localStorage.setItem(SITES_KEY, JSON.stringify(sites));
};

export const loadSites = (): Site[] => {
  const storedSites = localStorage.getItem(SITES_KEY);
  if (!storedSites) return [];
  
  try {
    return JSON.parse(storedSites);
  } catch (error) {
    console.error('Failed to parse sites from localStorage:', error);
    return [];
  }
};