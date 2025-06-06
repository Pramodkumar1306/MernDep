import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LogOut from "../components/LogOut.jsx";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function SitePage() {
  const navigate = useNavigate();
  const { site } = useParams();

  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    date: "",
    description: "",
    amount: "",
    paymentMode: "Cash",
    category: "Salary",
  });

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");

  const paymentModes = ["Cash", "UPI", "Bank Transfer"];
  const categories = ["None", "Petrol/Desal", "Material", "Salary"];

  const filteredExpenses = expenses.filter((e) => {
    const descMatch = e.description?.toLowerCase().includes(searchText.toLowerCase());
    const catMatch = selectedCategory ? e.category === selectedCategory : true;
    const payMatch = selectedPaymentMode ? e.paymentMode === selectedPaymentMode : true;
    return descMatch && catMatch && payMatch;
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/getAllExpenses`, {
          site,
        });
        const data = response.data.data || [];
        const normalized = data.map((item) => ({
          date: item.date || item.Date || "",
          description: item.description || item.Description || "",
          amount: item.amount || item.Amount || 0,
          paymentMode: item.paymentMode || item.Payment || "",
          category: item.category || item.Category || "",
        }));
        setExpenses(normalized);
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
      }
    };
    fetchExpenses();
  }, [site]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = async () => {
    const payload = {
      site,
      Date: form.date,
      Description: form.description,
      Amount: form.amount,
      Payment: form.paymentMode,
      Category: form.category,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setExpenses((prev) => [
          ...prev,
          {
            date: form.date,
            description: form.description,
            amount: form.amount,
            paymentMode: form.paymentMode,
            category: form.category,
          },
        ]);
        setForm({
          date: "",
          description: "",
          amount: "",
          paymentMode: "Cash",
          category: "Salary",
        });
      } else {
        alert("Failed to add expense: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Server error while adding expense.");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Expense Report for Site: ${site}`, 14, 15);
    const tableData = filteredExpenses.map((e, i) => [
      i + 1,
      e.date,
      e.description,
      `₹${e.amount}`,
      e.paymentMode,
      e.category,
    ]);
    doc.autoTable({
      head: [["#", "Date", "Description", "Amount", "Payment Mode", "Category"]],
      body: tableData,
      startY: 25,
      styles: { fontSize: 10 },
      theme: "striped",
    });
    doc.save(`${site}-expenses.pdf`);
  };

  const downloadCSV = () => {
    if (filteredExpenses.length === 0) return;
    const headers = ["#", "Date", "Description", "Amount", "Payment Mode", "Category"];
    const rows = filteredExpenses.map((e, i) => [
      i + 1,
      new Date(e.date).toLocaleDateString("en-IN"),
      e.description,
      e.amount,
      e.paymentMode,
      e.category,
    ]);
    const total = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    rows.push(["", "", "", `Total: ₹${total}`, "", ""]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${site}-expenses.csv`;
    link.click();
  };

  const total = filteredExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen pt-8 sm:pt-12">
      <div className="hidden sm:block mb-4 flex justify-end">
        <LogOut />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-6">Expense Tracker</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Expenses" value={`₹${total}`} color="text-green-600" />
        <StatCard label="Total Entries" value={filteredExpenses.length} color="text-blue-600" />
        <StatCard label="Site" value={site} color="text-gray-600" capitalize />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input name="date" type="date" value={form.date} onChange={handleChange} />
          <Input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
          <Input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount (₹)" />
          <Select name="paymentMode" value={form.paymentMode} onChange={handleChange} options={paymentModes} />
          <Select name="category" value={form.category} onChange={handleChange} options={categories} />
          <button onClick={handleAddExpense} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Expense</button>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded shadow">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold">Expense Entries</h2>
          <div className="flex gap-2 flex-wrap">
            <button onClick={generatePDF} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Download PDF</button>
            <button onClick={downloadCSV} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">Download CSV</button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-4">
          <input type="text" placeholder="Search Description" className="border p-2 rounded w-full sm:w-auto" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
          <select className="border p-2 rounded w-full sm:w-auto" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select className="border p-2 rounded w-full sm:w-auto" value={selectedPaymentMode} onChange={(e) => setSelectedPaymentMode(e.target.value)}>
            <option value="">All Payment Modes</option>
            {paymentModes.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
          </select>
        </div>

        {filteredExpenses.length === 0 ? (
          <p className="text-gray-500">No expenses match the filters.</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[600px] w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  {["#", "Date", "Description", "Amount (₹)", "Payment Mode", "Category"].map((head, i) => (
                    <th key={i} className="border px-2 py-2 whitespace-nowrap">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((e, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-2">{i + 1}</td>
                    <td className="border px-2 py-2">{new Date(e.date).toLocaleDateString("en-IN")}</td>
                    <td className="border px-2 py-2">{e.description}</td>
                    <td className="border px-2 py-2">₹{e.amount}</td>
                    <td className="border px-2 py-2">{e.paymentMode}</td>
                    <td className="border px-2 py-2">{e.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button onClick={() => navigate("/")} className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded w-full sm:w-auto">← Back</button>
      </div>
    </div>
  );
}

function Input({ name, value, onChange, type = "text", placeholder = "" }) {
  return <input name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} className="border p-2 rounded w-full" />;
}

function Select({ name, value, onChange, options = [] }) {
  return (
    <select name={name} value={value} onChange={onChange} className="border p-2 rounded w-full">
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

function StatCard({ label, value, color = "text-gray-600", capitalize = false }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <p className="text-gray-600">{label}</p>
      <p className={`${color} text-xl font-bold ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}
