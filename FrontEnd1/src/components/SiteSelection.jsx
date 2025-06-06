    import { useEffect, useState } from "react";
    import { useNavigate } from "react-router-dom";
    import axios from "axios";
    import LogOut from '../components/LogOut.jsx'
    import NavBar from '../components/NavBar.jsx'
    export default function SiteSelection() {
    const [sites, setSites] = useState([]);
    const [newSite, setNewSite] = useState("");
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
        const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/expenses/deleteCollection/${siteName}`);
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

    return (
        <>
        <NavBar/>
        
        <div className="flex items-center justify-center min-h-screen bg-blue-100 p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Site Name</h2>

            <div className="flex items-center justify-center mb-4 space-x-2">
                <input
                className="border border-gray-300 rounded px-4 py-2 w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newSite}
                onChange={e => setNewSite(e.target.value)}
                placeholder="Enter new site name"
                />
                <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                onClick={addSite}
                >
                + Add Site
                </button>
            </div>

            {sites.length === 0 ? (
                <p className="text-gray-500">No sites added yet. Add your first site above.</p>
            ) : (
                <ul className="space-y-2 mt-4 text-left">
                {sites.map(site => (
                    <li
                    key={site.name}
                    onClick={() => navigate(`/site/${site.name}`)}
                    className="cursor-pointer px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded transition"
                    >
                    {site.name}
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(site.name);
                        }}
                        className="float-right ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        Delete
                    </button>
                    </li>
                ))}
                </ul>
            )}
            </div>
        </div>
        </>
    );
    }   
