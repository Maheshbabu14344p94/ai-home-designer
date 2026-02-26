import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ChatbotWidget';
import { Sparkles, Home, MapPin, CheckCircle2 } from 'lucide-react';
import { getRecommendations } from '../services/recommendService';
import { getImageUrl } from '../services/api';

const styles = ['Modern', 'Traditional', 'Contemporary', 'Minimalist', 'Rustic', 'Colonial'];

const qualityFields = [
  { key: 'soilTestStructuralDesign', label: 'Soil Test & Structural Design' },
  { key: 'highGradeSteelCement', label: 'High-Grade Steel/Cement' },
  { key: 'superiorWaterproofing', label: 'Superior Waterproofing' },
  { key: 'doubleGlazedWindowsInsulation', label: 'Double Glazed + High-R Insulation' },
  { key: 'extraElectricalConduitsDataCabling', label: 'Extra Electrical + Data Cabling' },
  { key: 'properDrainageSystem', label: 'Proper Drainage' },
];

export default function UserDashboard() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    landSize: 5000,
    budgetMin: 1500000,
    budgetMax: 5000000,
    floors: 2,
    bhk: '2BHK',
    style: 'Modern',
    vastuPreference: 'flexible',
    location: '',
    soilTestStructuralDesign: false,
    highGradeSteelCement: false,
    superiorWaterproofing: false,
    doubleGlazedWindowsInsulation: false,
    extraElectricalConduitsDataCabling: false,
    properDrainageSystem: false,
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!filters.landSize || !filters.budgetMin || !filters.budgetMax) {
      setError('Land size, budget min and budget max are required.');
      setLoading(false);
      return;
    }

    if (Number(filters.landSize) <= 400) {
      setError('Land size must be greater than 400 sq.ft.');
      setLoading(false);
      return;
    }

    if (Number(filters.budgetMin) < 500000) {
      setError('Minimum budget must be at least ₹5,00,000.');
      setLoading(false);
      return;
    }

    if (Number(filters.budgetMin) > Number(filters.budgetMax)) {
      setError('Minimum budget cannot be greater than maximum budget.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...filters,
        landSize: Number(filters.landSize),
        budgetMin: Number(filters.budgetMin),
        budgetMax: Number(filters.budgetMax),
        floors: Number(filters.floors),
      };

      const response = await getRecommendations(payload);
      setRecommendations(response.recommendations || []);
      setSearched(true);
    } catch (err) {
      setError(err?.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      <Navbar />

      <div className="flex-1 container-custom py-8">
        <h1 className="text-4xl font-bold mb-8 text-slate-900">Find Your Perfect Home Design</h1>

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Land Size: {Number(filters.landSize).toLocaleString()} sq.ft
                </label>
                <input
                  type="range"
                  min="401"
                  max="15000"
                  step="100"
                  value={filters.landSize}
                  onChange={(e) => setFilters({ ...filters, landSize: Number(e.target.value) })}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Budget Range</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    min="500000"
                    placeholder="Min (₹)"
                    value={filters.budgetMin}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        budgetMin: e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="number"
                    min="500000"
                    placeholder="Max (₹)"
                    value={filters.budgetMax}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        budgetMax: e.target.value === '' ? '' : Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Number of Floors</label>
                <select
                  value={filters.floors}
                  onChange={(e) => setFilters({ ...filters, floors: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value={1}>1 Floor</option>
                  <option value={2}>2 Floors</option>
                  <option value={3}>3 Floors</option>
                  <option value={4}>4 Floors</option>
                  <option value={5}>5 Floors</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">BHK</label>
                <select
                  value={filters.bhk}
                  onChange={(e) => setFilters({ ...filters, bhk: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="4BHK">4BHK</option>
                  <option value="5BHK">5BHK</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Location</label>
                <input
                  type="text"
                  placeholder="City / Area (optional)"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

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

            <div>
              <label className="block text-sm font-semibold mb-3">Quality Preferences (Optional)</label>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {qualityFields.map((q) => (
                  <label key={q.key} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white">
                    <input
                      type="checkbox"
                      checked={!!filters[q.key]}
                      onChange={(e) => setFilters({ ...filters, [q.key]: e.target.checked })}
                    />
                    <span className="text-sm">{q.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2"
            >
              <Sparkles size={20} /> {loading ? 'Searching...' : 'Find Designs'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

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
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition"
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(design.imagePath || design.imageUrl)}
                        alt={design.modelName}
                        className="w-full h-52 object-cover bg-gray-200 cursor-pointer"
                        onClick={() => navigate(`/designs/${design._id}`)}
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/800x600?text=${encodeURIComponent(
                            design.modelName || 'Design'
                          )}`;
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                        {Math.round(design.matchScore || 0)}% Match
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{design.modelName || 'Untitled Design'}</h3>
                      <p className="text-sm text-gray-600 mb-3">{design.style}</p>

                      <div className="text-sm text-gray-700 space-y-1 mb-3">
                        <p>💰 ₹{Number(design.budgetMin || 0).toLocaleString()} - ₹{Number(design.budgetMax || 0).toLocaleString()}</p>
                        <p>📏 {design.landSizeRequired} sq.ft</p>
                        <p>🏠 {design.bhk || 'N/A'} • 🏢 {design.floors} Floor(s)</p>
                        {design.location && (
                          <p className="flex items-center gap-1"><MapPin size={14} /> {design.location}</p>
                        )}
                        <p>{design.vastuCompliant ? '✅ Vastu Compliant' : '❌ Vastu Not Included'}</p>
                        <p>{design.soilTestStructuralDesign ? '✅ Soil Test & Structural Design' : '❌ Soil Test & Structural Design'}</p>
                        <p>{design.highGradeSteelCement ? '✅ High-Grade Steel/Cement' : '❌ High-Grade Steel/Cement'}</p>
                        <p>{design.superiorWaterproofing ? '✅ Superior Waterproofing' : '❌ Superior Waterproofing'}</p>
                        <p>{design.doubleGlazedWindowsInsulation ? '✅ Double Glazed + Insulation' : '❌ Double Glazed + Insulation'}</p>
                        <p>{design.extraElectricalConduitsDataCabling ? '✅ Extra Electrical/Data Cabling' : '❌ Extra Electrical/Data Cabling'}</p>
                        <p>{design.properDrainageSystem ? '✅ Proper Drainage System' : '❌ Proper Drainage System'}</p>
                      </div>

                      {design.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{design.description}</p>
                      )}

                      <p className="text-sm text-gray-600 mb-4">
                        By {design.architectId?.name || 'Unknown Architect'}
                      </p>

                      <button
                        onClick={() => navigate(`/designs/${design._id}`)}
                        className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Open Full View
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

      <Footer />
      <ChatbotWidget />
    </div>
  );
}