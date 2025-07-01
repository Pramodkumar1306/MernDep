import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import LogOut from "../components/LogOut.jsx";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import letterhead from '../assets/letterhead.jpg'

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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const paymentModes = ["Cash", "UPI", "Bank Transfer"];
  const categories = ["None", "Fuel", "Material", "Salary","Miscellaneous"];

  const filteredExpenses = expenses
    .filter((e) => {
      const descMatch = e.description?.toLowerCase().includes(searchText.toLowerCase());
      const catMatch = selectedCategory ? e.category === selectedCategory : true;
      const payMatch = selectedPaymentMode ? e.paymentMode === selectedPaymentMode : true;

      const expenseDate = new Date(e.date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const fromMatch = from ? expenseDate >= from : true;
      const toMatch = to ? expenseDate <= to : true;

      return descMatch && catMatch && payMatch && fromMatch && toMatch;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/getAllExpenses`, {
          site,
        });
        const data = response.data.data || [];
        const normalized = data.map((item) => ({
          _id: item._id, // <-- THIS IS MISSING
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
  if (!form.date || !form.description || !form.amount) {
    alert("Please fill in all required fields.");
    return;
  }

  // const formatDate = (date) => new Date(date).toISOString().slice(0, 10);
  console.log(editingIndex);
  
  if (editingIndex !== null) {
    // Editing mode — make an API call
    const payload = {
      site,
      Date: form.date,
      Description: form.description,
      Amount: form.amount,
      Payment: form.paymentMode,
      Category: form.category,
    };

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/expenses/update/${form._id}`,
        payload
      );

      if (res.data.success) {
        const updated = [...expenses];
        updated[editingIndex] = {
          _id: form._id,
          date: form.date,
          description: form.description,
          amount: form.amount,
          paymentMode: form.paymentMode,
          category: form.category,
        };
        setExpenses(updated);
        setEditingIndex(null);
        alert("✏️ Expense updated successfully!");
      } else {
        alert("Failed to update expense: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error updating expense:", err);
      alert("Server error while updating expense.");
    }
  } else {
    // Add new expense mode
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
            _id: result.data ? result.data._id : undefined,
            date: form.date,
            description: form.description,
            amount: form.amount,
            paymentMode: form.paymentMode,
            category: form.category,
          },
        ]); 
        // setExpenses((prev) => [
        //   ...prev,
        //   {
        //     //  _id: result.data._id, // <-- Add this
        //     date: form.date,
        //     description: form.description,
        //     amount: form.amount,
        //     paymentMode: form.paymentMode,
        //     category: form.category,
        //   },
        // ]);
        alert("✅ Expense Added successfully!");
      } else {
        alert("Failed to add expense: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Server error while adding expense.");
    }
  }

  // Reset form
setForm({
    _id:null,
    date: "",
    description: "",
    amount: "",
    paymentMode: "Cash",
    category: "Salary",
  });
};

const handleEdit = (indexInFiltered) => {
      const item = filteredExpenses[indexInFiltered];
      console.log(item)
      const formatDate = (date) => new Date(date).toISOString().slice(0, 10);
      const realIndex = expenses.findIndex((e) => e._id === item._id);
      // const realIndex = expenses.findIndex(
      //   (e) =>
      //     formatDate(e.date) === formatDate(item.date) &&
      //     e.description === item.description &&
      //     Number(e.amount) === Number(item.amount) &&
      //     e.paymentMode === item.paymentMode &&
      //     e.category === item.category
      // );
      // console.log(realIndex);
      
      if (realIndex !== -1) {
        setForm({
          _id: item._id, // <-- Add this li
          date: formatDate(item.date),
          description: item.description,
          amount: item.amount,
          paymentMode: item.paymentMode,
          category: item.category,
        });
        setEditingIndex(realIndex);
      }
    };

const handleDelete = async (indexInFiltered) => {
  if (window.confirm("Are you sure you want to delete this expense?")) {
    const itemToDelete = filteredExpenses[indexInFiltered];
    // console.log(itemToDelete._id);
    
    console.log(itemToDelete)
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/expenses/delete/${site}/${itemToDelete._id}`
      );

      if (res.data.success) {
        const indexInExpenses = expenses.findIndex((e) => e._id === itemToDelete._id);

//         const indexInExpenses = expenses.findIndex(
//           (e) =>
//             e.date === itemToDelete.date &&
//             e.description === itemToDelete.description &&
//             Number(e.amount) === Number(itemToDelete.amount) &&
//             e.paymentMode === itemToDelete.paymentMode &&
//             e.category === itemToDelete.category
//         );
        if (indexInExpenses > -1) {
          const updated = [...expenses];
          updated.splice(indexInExpenses, 1);
          setExpenses(updated);
        }

        alert("🗑️ Expense deleted successfully!");
      } else {
          alert("Failed to delete from server: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("Server error while deleting expense.");
    }
  }
};


const generatePDF = () => {
  const doc = new jsPDF();
  const pdfWidth = doc.internal.pageSize.getWidth();
  const pdfHeight = doc.internal.pageSize.getHeight();

  doc.addImage(letterhead, "JPEG", 0, 0, pdfWidth, pdfHeight);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`${site}`, 10, 40, { align: "left" });

  const fromDateText = fromDate ? new Date(fromDate).toLocaleDateString("en-IN") : "-";
  const toDateText = toDate ? new Date(toDate).toLocaleDateString("en-IN") : "-";

  doc.text(`From: ${fromDateText}  ${toDateText}`, pdfWidth - 10, 40, { align: "right" });

  const tableColumn = ["S.No", "Date", "Description", "Amount", "Payment Mode", "Category"];
  const rowsPerPage = 28;
  let startY = 45;

  // 🔢 Total amount
  const totalAmount = filteredExpenses.reduce((acc, e) => acc + Number(e.amount), 0);

  for (let i = 0; i < filteredExpenses.length; i += rowsPerPage) {
    const isLastChunk = i + rowsPerPage >= filteredExpenses.length;

    const rowsChunk = filteredExpenses.slice(i, i + rowsPerPage).map((e, idx) => [
      i + idx + 1,
      new Date(e.date).toLocaleDateString("en-IN"),
      e.description,
      `${Number(e.amount).toLocaleString("en-IN")}`,
      e.paymentMode,
      e.category,
    ]);

    // ✅ Add TOTAL row only on the last chunk
    if (isLastChunk) {
      rowsChunk.push([
        { content: "", colSpan: 2 },
        { content: "Total", styles: { halign: "right", fontStyle: "bold" } },
        { content: `${totalAmount.toLocaleString("en-IN")}`, styles: { fontStyle: "bold" } },
        "", ""
      ]);
    }

    autoTable(doc, {
      head: [tableColumn],
      body: rowsChunk,
      startY,
      margin: { left: 10, right: 10 },
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      pageBreak: "avoid",
    });

    if (!isLastChunk) {
      doc.addPage();
      doc.addImage(letterhead, "JPEG", 0, 0, pdfWidth, pdfHeight);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${site}`, 10, 40, { align: "left" });
      doc.text(`From: ${fromDateText}  ${toDateText}`, pdfWidth - 10, 40, { align: "right" });
      startY = 45;
    }
  }

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
    rows.push(["", "", "", `Total: ₹  ${total}`, "", ""]);
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
        <div className="mb-4 flex justify-center sm:justify-end">
          {/* <LogOut /> */}
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
          >
            ← Back
          </button>
        </div>


      <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-6">Expense Tracker</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Expenses" value={`₹${total}`} color="text-green-600" />
        <StatCard label="Total Entries" value={filteredExpenses.length} color="text-blue-600" />
        <StatCard label="Site" value={site} color="text-gray-600" capitalize />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">{editingIndex !== null ? "Edit Expense" : "Add New Expense"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <label className="block sm:hidden text-sm font-medium text-gray-700 ">Date</label>
          <Input name="date" type="date" value={form.date} onChange={handleChange} placeholder="Date" />
          {/* <Input name="date" type="date" value={form.date} onChange={handleChange} placeholder="Date" /> */}
          <Input name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
          <Input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount (₹)" required />
          <Select name="paymentMode" value={form.paymentMode} onChange={handleChange} options={paymentModes} />
          <Select name="category" value={form.category} onChange={handleChange} options={categories} />
          <button onClick={handleAddExpense} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingIndex !== null ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded shadow">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <h2 className="text-lg font-semibold">Expense Entries</h2>
          <div className="flex gap-2 flex-wrap">
            <button onClick={generatePDF} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Download PDF
            </button>
            <button onClick={downloadCSV} className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
              Download CSV
            </button>
            
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search Description"
            className="border p-2 rounded w-full sm:w-auto"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <select
            className="border p-2 rounded w-full sm:w-auto"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            className="border p-2 rounded w-full sm:w-auto"
            value={selectedPaymentMode}
            onChange={(e) => setSelectedPaymentMode(e.target.value)}
          >
            <option value="">All Payment Modes</option>
            {paymentModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
          <label className="block sm:hidden text-sm font-medium text-gray-700 mb-1">Date From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
            placeholder="From Date"
          />
          <label className="block sm:hidden text-sm font-medium text-gray-700 mb-1">Date To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
            placeholder="To Date"
          />
        </div>

        {filteredExpenses.length === 0 ? (
          <p className="text-gray-500">No expenses match the filters.</p>
        ) : (
          // ONLY on small screens allow horizontal scroll, on larger screens no scroll needed
          <div className="sm:overflow-x-visible overflow-x-auto">
            <table className="min-w-[600px] w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  {["SNo", "Date", "Description", "Amount (₹)", "Payment Mode", "Category", "Actions"].map((head, i) => (
                    <th key={i} className="border px-2 py-2 whitespace-nowrap">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((e, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-2">{i + 1}</td>
                    <td className="border px-2 py-2">{new Date(e.date).toLocaleDateString("en-IN")}</td>
                    <td className="border px-2 py-2">{e.description}</td>
                    <td className="border px-2 py-2">₹ {e.amount}</td>
                    <td className="border px-2 py-2">{e.paymentMode}</td>
                    <td className="border px-2 py-2">{e.category}</td>
                    <td className="border px-2 py-2 flex gap-2">
                      <button className="text-blue-600 cursor-pointer"  onClick={() => handleEdit(i)}>
                        Edit
                      </button>
                      <button className="text-red-600 cursor-pointer" onClick={() => handleDelete(i)}>
                        Delete
                      </button>
                    </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
      </div>
    </div>
  );
}

function Input({ name, value, onChange, type = "text", placeholder = "", required = true }) {
  return <input name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} required={required} className="border p-2 rounded w-full" />;
}

function Select({ name, value, onChange, options = [] }) {
  return (
    <select name={name} value={value} onChange={onChange} className="border p-2 rounded w-full">
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
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
