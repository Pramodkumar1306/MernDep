// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const ExpenseContext = createContext();

// export const useExpense = () => useContext(ExpenseContext);

// export function ExpenseProvider({ children, site }) {
//   const [expenses, setExpenses] = useState([]);

//   useEffect(() => {
//     const fetchExpenses = async () => {
//       try {
//         const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/getAllExpenses`, { site });
//         const data = response.data.data || [];
//         const normalized = data.map((item) => ({
//           date: item.date || item.Date || "",
//           description: item.description || item.Description || "",
//           amount: item.amount || item.Amount || 0,
//           paymentMode: item.paymentMode || item.Payment || "",
//           category: item.category || item.Category || "",
//         }));
//         setExpenses(normalized);
//       } catch (err) {
//         console.error("Failed to fetch expenses:", err);
//       }
//     };
//     fetchExpenses();
//   }, [site]);

//   return (
//     <ExpenseContext.Provider value={{ expenses, setExpenses }}>
//       {children}
//     </ExpenseContext.Provider>
//   );
// }
