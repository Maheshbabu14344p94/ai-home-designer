import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ChatbotWidget';
import { Sparkles, Home, X } from 'lucide-react';
import { getRecommendations } from '../services/recommendService';
import { getImageUrl } from '../services/api';

export default function UserDashboard() {
  const [filters, setFilters] = useState({
    landSize: 5000,
    budgetMin: 1500000,
    budgetMax: 5000000,
    floors: 2,
    style: 'Modern',
    vastuPreference: 'flexible',
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [selectedDesign, setSelectedDesign] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await getRecommendations(filters);
      setRecommendations(response.recommendations || []);
      setSearched(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  const styles = ['Modern', 'Traditional', 'Contemporary', 'Minimalist', 'Rustic', 'Colonial'];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 container-custom py-8">
        <h1 className="text-4xl font-bold mb-8">Find Your Perfect Home Design</h1>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Land Size */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Land Size: {filters.landSize.toLocaleString()} sq.ft
                </label>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="500"
                  value={filters.landSize}
                  onChange={(e) => setFilters({ ...filters, landSize: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-semibold mb-2">Budget Range</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min (₹)"
                    value={filters.budgetMin}
                    onChange={(e) => setFilters({ ...filters, budgetMin: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="number"
                    placeholder="Max (₹)"
                    value={filters.budgetMax}
                    onChange={(e) => setFilters({ ...filters, budgetMax: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Floors */}
              <div>
                <label className="block text-sm font-semibold mb-2">Number of Floors</label>
                <select
                  value={filters.floors}
                  onChange={(e) => setFilters({ ...filters, floors: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value={1}>1 Floor</option>
                  <option value={2}>2 Floors</option>
                  <option value={3}>3 Floors</option>
                  <option value={5}>3+ Floors</option>
                </select>
              </div>

              {/* Vastu */}
              <div>
                <label className="block text-sm font-semibold mb-2">Vastu Preference</label>
                <select
                  value={filters.vastuPreference}
                  onChange={(e) => setFilters({ ...filters, vastuPreference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="none">Not Important</option>
                  <option value="flexible">Flexible</option>
                  <option value="strict">Strict</option>
                </select>
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-sm font-semibold mb-4">Design Style</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {styles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setFilters({ ...filters, style })}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      filters.style === style
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              <Sparkles size={20} /> {loading ? 'Searching...' : 'Find Designs'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Results */}
        {searched && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {recommendations.length === 0
                ? 'No designs found. Try adjusting your criteria.'
                : `Found ${recommendations.length} Design${recommendations.length !== 1 ? 's' : ''}`}
            </h2>

            {recommendations.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((design) => (
                  <div
                    key={design._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(design.imagePath || design.imageUrl)}
                        alt={design.modelName}
                        className="w-full h-48 object-cover bg-gray-200"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=' + design.modelName;
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full font-bold">
                        {Math.round(design.matchScore)}% Match
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{design.modelName}</h3>
                      <p className="text-sm text-gray-600 mb-4">{design.style}</p>
                      <div className="text-sm text-gray-700 space-y-2 mb-4">
                        <p>💰 ₹{design.budgetMin.toLocaleString()} - ₹{design.budgetMax.toLocaleString()}</p>
                        <p>📏 {design.landSizeRequired} sq.ft</p>
                        <p>🏢 {design.floors} Floor(s)</p>
                        {design.vastuCompliant && <p>✅ Vastu Compliant</p>}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        By {design.architectId?.name || 'Unknown Architect'}
                      </p>
                      <button 
                        onClick={() => setSelectedDesign(design)}
                        className="btn-primary w-full"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!searched && (
          <div className="text-center py-16">
            <Home className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">Enter your preferences above to find perfect home designs</p>
          </div>
        )}
      </div>

      {/* Design Details Modal */}
      {selectedDesign && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedDesign(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">{selectedDesign.modelName}</h2>
              <button
                onClick={() => setSelectedDesign(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <img
                src={getImageUrl(selectedDesign.imagePath || selectedDesign.imageUrl)}
                alt={selectedDesign.modelName}
                className="w-full h-64 object-cover rounded-lg bg-gray-200"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400?text=' + selectedDesign.modelName;
                }}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-600 mb-2">Design Style</h3>
                  <p className="text-lg text-gray-800">{selectedDesign.style}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-600 mb-2">Number of Floors</h3>
                  <p className="text-lg text-gray-800">{selectedDesign.floors}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-600 mb-2">Budget Range</h3>
                  <p className="text-lg text-gray-800">
                    ₹{selectedDesign.budgetMin.toLocaleString()} - ₹{selectedDesign.budgetMax.toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-600 mb-2">Land Size Required</h3>
                  <p className="text-lg text-gray-800">{selectedDesign.landSizeRequired} sq.ft</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-600 mb-2">Match Score</h3>
                  <p className="text-lg text-green-600 font-bold">{Math.round(selectedDesign.matchScore)}%</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-600 mb-2">Vastu Compliant</h3>
                  <p className="text-lg text-gray-800">
                    {selectedDesign.vastuCompliant ? '✅ Yes' : '❌ No'}
                  </p>
                </div>
              </div>

              {selectedDesign.description && (
                <div>
                  <h3 className="font-semibold text-gray-600 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedDesign.description}</p>
                </div>
              )}

              {selectedDesign.architectId && (
                <div className="border-t pt-4 bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Contact Architect</h3>
                  <div className="space-y-2">
                    <p className="text-gray-800">
                      <span className="font-semibold">Name:</span> {selectedDesign.architectId.name}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-semibold">Email:</span> 
                      <a 
                        href={`mailto:${selectedDesign.architectId.email}`}
                        className="text-blue-600 hover:underline ml-2"
                      >
                        {selectedDesign.architectId.email}
                      </a>
                    </p>
                    {selectedDesign.architectId.phone && (
                      <p className="text-gray-800">
                        <span className="font-semibold">Phone:</span> 
                        <a 
                          href={`tel:${selectedDesign.architectId.phone}`}
                          className="text-blue-600 hover:underline ml-2"
                        >
                          {selectedDesign.architectId.phone}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedDesign(null)}
                className="btn-secondary w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ChatbotWidget />
    </div>
  );
}