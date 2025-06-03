import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Site } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface SiteSelectorProps {
  onSiteSelect: (site: Site) => void;
  sites: Site[];
  onAddSite: (site: Site) => void;
}

const SiteSelector: React.FC<SiteSelectorProps> = ({ onSiteSelect, sites, onAddSite }) => {
  const [newSiteName, setNewSiteName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim()) return;

    const newSite: Site = {
      id: uuidv4(),
      name: newSiteName.trim()
    };

    onAddSite(newSite);
    setNewSiteName('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Contractor Site Selection
        </h1>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
              placeholder="Enter new site name"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center gap-2"
            >
              <Plus size={18} />
              <span>Add Site</span>
            </button>
          </div>
        </form>

        {sites.length > 0 ? (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Site:</h2>
            {sites.map((site) => (
              <button
                key={site.id}
                onClick={() => onSiteSelect(site)}
                className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-md transition duration-300 border border-gray-200"
              >
                {site.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No sites added yet. Add your first site above.</p>
        )}
      </div>
    </div>
  );
};

export default SiteSelector;