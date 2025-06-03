// ✅ models/getModelBySite.js
import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    description: String,
    amount: Number,
    paymentMode: String,
    category: String,
});

// This dynamically returns a Mongoose model for any site name
export const getModelBySite = (siteName) => {
  const modelName = siteName.charAt(0).toUpperCase() + siteName.slice(1); // e.g., 'mysite' -> 'Mysite'
    return mongoose.models[modelName] || mongoose.model(modelName, expenseSchema, siteName);
};
