// models/getModelBySite.js
import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  description: String,
  amount: Number,
  paymentMode: String,
  category: String,
});

// Function to return a dynamic model
export const getModelBySite = (siteName) => {
  const modelName = siteName.charAt(0).toUpperCase() + siteName.slice(1); // e.g., 'abc' -> 'Abc'
  return mongoose.models[modelName] || mongoose.model(modelName, expenseSchema, siteName);
};
