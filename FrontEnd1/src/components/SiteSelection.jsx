import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from '../components/NavBar.jsx';
import { Eye, Edit, Trash } from 'lucide-react';

export default function SiteSelection() {
  const [sites, setSites] = useState([]);
  const [newSite, setNewSite] = useState("");
  const [editingSite, setEditingSite] = useState(null);
  const [editedName, setEditedName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/getCollections`);
        const siteArray = res.data.data.map(name => ({ name }));
        setSites(siteArray);
      } catch (err) {
        console.error("Error fetching sites:", err);
      }
    };
    fetchSites();
  }, []);

  const handleDelete = async (siteName) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${siteName}"?`);
    if (!confirmed) return;

    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/deleteCollection/${encodeURIComponent(siteName)}`);
      const updatedSites = res.data.data.map(name => ({ name }));
      setSites(updatedSites);
    } catch (err) {
      console.error("Error deleting site:", err);
    }
  };

  const addSite = async () => {
    if (!newSite.trim()) return;
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/createCollection`, { site: newSite });
      const updatedSites = res.data.data.map(name => ({ name }));
      setSites(updatedSites);
      setNewSite("");
    } catch (err) {
      console.error("Error adding site:", err);
    }
  };

  const startEditing = (siteName) => {
    setEditingSite(siteName);
    setEditedName(siteName);
  };

  const cancelEditing = () => {
    setEditingSite(null);
    setEditedName("");
  };

  const saveEdit = async () => {
    if (!editedName.trim() || editedName === editingSite) {
      cancelEditing();
      return;
    }
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/renameCollection`, {
        oldName: editingSite,
        newName: editedName
      });
      const updatedSites = res.data.data.map(name => ({ name }));
      setSites(updatedSites);
      cancelEditing();
    } catch (err) {
      console.error("Error renaming site:", err);
    }
  };

  return (
    <>
      <NavBar />

      <div className="p-4 sm:p-6">
        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-2">ADD The Site Name</h1>
        <p className="text-center text-gray-600 mb-6">Search and add items to your cart instantly</p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 w-full px-4">
          <input
            value={newSite}
            onChange={(e) => setNewSite(e.target.value)}
            placeholder="Search for products..."
            className="w-full sm:w-[400px] border border-blue-400 rounded-full px-6 py-2 outline-none"
          />
          <button onClick={addSite} className="w-full sm:w-auto bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600">
            + Add to Cart
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Your Sites</h2>
          {sites.length === 0 ? (
            <div className="text-center text-gray-500 text-base sm:text-lg">Your cart is empty</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.map((site) => (
                <div key={site.name} className="bg-white shadow-lg rounded-xl p-4 flex flex-col justify-between">
                  <div className="text-base sm:text-lg font-medium text-gray-800 mb-4">
                    {editingSite === site.name ? (
                      <input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      site.name
                    )}
                  </div>
                  <div className="flex gap-4 justify-end text-blue-500">
                    <Eye className="cursor-pointer hover:text-blue-700" onClick={() => navigate(`/site/${site.name}`)} />
                    {editingSite === site.name ? (
                      <>
                        <button onClick={saveEdit} className="text-green-600 hover:underline text-sm">Save</button>
                        <button onClick={cancelEditing} className="text-gray-500 hover:underline text-sm">Cancel</button>
                      </>
                    ) : (
                      <Edit className="cursor-pointer hover:text-purple-600" onClick={() => startEditing(site.name)} />
                    )}
                    <Trash
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(site.name)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
