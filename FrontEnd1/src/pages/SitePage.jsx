import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
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

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.post(`http://localhost:4000/api/expenses/getAllExpenses`, {
          site: site
        });
        const data = response.data.data;

        const normalized = data.map((item) => ({
  date: item.date || item.Date,
  description: item.description || item.Description,
  amount: item.amount || item.Amount,
  paymentMode: item.paymentMode || item.Payment,
  category: item.category || item.Category,
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
      const res = await fetch("http://localhost:4000/api/expenses/add", {
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

    const tableData = expenses.map((e, i) => [
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

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const colorClasses = {
    green: "text-green-600",
    blue: "text-blue-600",
    gray: "text-gray-600",
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
        Contractor Expense Tracker
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Expenses" value={`₹${total}`} color={colorClasses.green} />
        <StatCard label="Total Entries" value={expenses.length} color={colorClasses.blue} />
        <StatCard label="Site" value={site} color={colorClasses.gray} capitalize />
      </div>

      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input name="date" type="date" value={form.date} onChange={handleChange} />
          <Input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
          <Input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount (₹)" />
          <Select name="paymentMode" value={form.paymentMode} onChange={handleChange} options={["Cash", "UPI", "Bank Transfer"]} />
          <Select name="category" value={form.category} onChange={handleChange} options={["Salary", "Petrol", "Material", "Stationery"]} />
          <button
            onClick={handleAddExpense}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Expense
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Expense Entries</h2>
          <button
            onClick={generatePDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download PDF
          </button>
        </div>

        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses added yet.</p>
        ) : (
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                {["#", "Date", "Description", "Amount (₹)", "Payment Mode", "Category"].map((head, i) => (
                  <th key={i} className="border px-2 py-1">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{i + 1}</td>
                  <td className="border px-2 py-1">{e.date}</td>
                  <td className="border px-2 py-1">{e.description}</td>
                  <td className="border px-2 py-1">₹{e.amount}</td>
                  <td className="border px-2 py-1">{e.paymentMode}</td>
                  <td className="border px-2 py-1">{e.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

// Reusable Subcomponents
function Input({ name, value, onChange, type = "text", placeholder = "" }) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      className="border p-2 rounded"
    />
  );
}

function Select({ name, value, onChange, options = [] }) {
  return (
    <select name={name} value={value} onChange={onChange} className="border p-2 rounded">
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

function StatCard({ label, value, color = "text-gray-600", capitalize = false }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-600">{label}</p>
      <p className={`${color} text-xl font-bold ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}
