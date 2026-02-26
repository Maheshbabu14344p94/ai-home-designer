import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Upload,
  Edit2,
  Trash2,
  AlertCircle,
  Phone,
  MapPin,
  Building2,
  IndianRupee,
  Ruler,
  CheckCircle2,
} from 'lucide-react';
import {
  uploadDesign,
  getArchitectDesigns,
  updateDesign,
  deleteDesign,
} from '../services/designService';
import { getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

const defaultFormData = {
  modelName: '',
  style: 'Modern',
  bhk: '2BHK',
  floors: '1',
  budgetMin: '',
  budgetMax: '',
  landSizeRequired: '',
  vastuCompliant: false,
  description: '',

  // New optional fields
  location: '',
  soilTestStructuralDesign: false,
  highGradeSteelCement: false,
  superiorWaterproofing: false,
  doubleGlazedWindowsInsulation: false,
  extraElectricalConduitsDataCabling: false,
  properDrainageSystem: false,
};

const qualityFeatures = [
  { key: 'soilTestStructuralDesign', label: 'Soil Test & Structural Design (Non-negotiable)' },
  { key: 'highGradeSteelCement', label: 'High-Grade Steel/Cement' },
  { key: 'superiorWaterproofing', label: 'Superior Waterproofing' },
  { key: 'doubleGlazedWindowsInsulation', label: 'Double Glazed Windows & High-R Value Insulation' },
  { key: 'extraElectricalConduitsDataCabling', label: 'Extra Electrical Conduits & Data Cabling' },
  { key: 'properDrainageSystem', label: 'Proper Drainage System' },
];

export default function ArchitectDashboard() {
  const { user } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState(defaultFormData);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const response = await getArchitectDesigns();
      setDesigns(response.designs || []);
    } catch (err) {
      setError('Failed to fetch designs');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
  };

  const toggleFormForNew = () => {
    if (showUploadForm && !editingId) {
      setShowUploadForm(false);
      resetForm();
      return;
    }
    resetForm();
    setShowUploadForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const floors = Number(formData.floors);
    const budgetMin = Number(formData.budgetMin);
    const budgetMax = Number(formData.budgetMax);
    const landSize = Number(formData.landSizeRequired);

    // Required fields
    if (!formData.floors || !formData.budgetMin || !formData.budgetMax || !formData.landSizeRequired) {
      setError('Required: Floors, Budget Min, Budget Max, and Land Size.');
      return false;
    }

    if (Number.isNaN(floors) || floors < 1) {
      setError('Floors must be at least 1.');
      return false;
    }

    if (Number.isNaN(budgetMin) || budgetMin < 500000) {
      setError('Minimum budget must be at least ₹5,00,000.');
      return false;
    }

    if (Number.isNaN(budgetMax) || budgetMax < budgetMin) {
      setError('Maximum budget must be greater than or equal to minimum budget.');
      return false;
    }

    if (Number.isNaN(landSize) || landSize <= 400) {
      setError('Land size must be greater than 400 sq.ft.');
      return false;
    }

    if (!imageFile && !editingId) {
      setError('Please select an image.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    try {
      setLoading(true);

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          data.append(key, String(value));
        } else {
          data.append(key, value ?? '');
        }
      });

      if (imageFile) data.append('image', imageFile);

      if (editingId) {
        await updateDesign(editingId, data);
        setSuccess('Design updated successfully!');
      } else {
        await uploadDesign(data);
        setSuccess('Design uploaded successfully!');
      }

      resetForm();
      setShowUploadForm(false);
      fetchDesigns();
    } catch (err) {
      setError(err?.message || 'Failed to save design');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (design) => {
    setFormData({
      modelName: design.modelName || '',
      style: design.style || 'Modern',
      bhk: design.bhk || '2BHK',
      floors: String(design.floors ?? '1'),
      budgetMin: String(design.budgetMin ?? ''),
      budgetMax: String(design.budgetMax ?? ''),
      landSizeRequired: String(design.landSizeRequired ?? ''),
      vastuCompliant: !!design.vastuCompliant,
      description: design.description || '',

      location: design.location || '',
      soilTestStructuralDesign: !!design.soilTestStructuralDesign,
      highGradeSteelCement: !!design.highGradeSteelCement,
      superiorWaterproofing: !!design.superiorWaterproofing,
      doubleGlazedWindowsInsulation: !!design.doubleGlazedWindowsInsulation,
      extraElectricalConduitsDataCabling: !!design.extraElectricalConduitsDataCabling,
      properDrainageSystem: !!design.properDrainageSystem,
    });

    setImagePreview(getImageUrl(design.imagePath || design.imageUrl));
    setImageFile(null);
    setEditingId(design._id);
    setShowUploadForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this design?')) return;

    try {
      await deleteDesign(id);
      setSuccess('Design deleted successfully!');
      fetchDesigns();
    } catch (err) {
      setError('Failed to delete design');
    }
  };

  const featureCount = (design) =>
    [
      design.soilTestStructuralDesign,
      design.highGradeSteelCement,
      design.superiorWaterproofing,
      design.doubleGlazedWindowsInsulation,
      design.extraElectricalConduitsDataCabling,
      design.properDrainageSystem,
    ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      <Navbar />

      <div className="flex-1 container-custom py-8">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-cyan-300/20 rounded-full blur-2xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">Architect Dashboard</h1>
              <p className="text-blue-100">Welcome, {user?.name}</p>
              {user?.phone && (
                <p className="text-blue-100 flex items-center gap-2 mt-2 text-sm">
                  <Phone size={16} /> {user.phone} (Visible to users)
                </p>
              )}
              <p className="text-blue-200 text-xs mt-2">
                Required fields: Floors, Budget Min/Max, Land Size
              </p>
            </div>

            <button
              onClick={toggleFormForNew}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:bg-blue-50 transition shadow-lg"
            >
              <Upload size={18} /> {showUploadForm && !editingId ? 'Close Form' : 'New Design'}
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-300 bg-red-50 text-red-700 px-4 py-3 flex items-center gap-2 shadow-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-green-300 bg-green-50 text-green-700 px-4 py-3 shadow-sm">
            {success}
          </div>
        )}

        {/* Upload / Edit Form */}
        {showUploadForm && (
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl border border-white p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-bold mb-1">
              {editingId ? 'Edit Design' : 'Upload New Design'}
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Add rich project details. Optional fields can be left empty.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Core Details */}
              <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Core Details</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Model Name (optional)"
                    value={formData.modelName}
                    onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <select
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Modern</option>
                    <option>Traditional</option>
                    <option>Contemporary</option>
                    <option>Minimalist</option>
                    <option>Rustic</option>
                    <option>Colonial</option>
                  </select>

                  <select
                    value={formData.bhk}
                    onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="4BHK">4BHK</option>
                    <option value="5BHK">5BHK</option>
                  </select>

                  <input
                    type="number"
                    min="1"
                    placeholder="Number of Floors *"
                    value={formData.floors}
                    onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="number"
                    min="401"
                    placeholder="Land Size Required (sq.ft) *"
                    value={formData.landSizeRequired}
                    onChange={(e) => setFormData({ ...formData, landSizeRequired: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="number"
                    min="500000"
                    placeholder="Budget Min (₹) *"
                    value={formData.budgetMin}
                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="number"
                    min="500000"
                    placeholder="Budget Max (₹) *"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Location (optional)"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="md:col-span-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description & Basic */}
              <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Description & Compliance</h3>

                <textarea
                  placeholder="Description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 mb-4"
                />

                <label className="inline-flex items-center gap-2 cursor-pointer bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <input
                    type="checkbox"
                    checked={formData.vastuCompliant}
                    onChange={(e) => setFormData({ ...formData, vastuCompliant: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Vastu Compliant</span>
                </label>
              </div>

              {/* Quality Features */}
              <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Construction Quality Features (Optional)</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {qualityFeatures.map((f) => (
                    <label
                      key={f.key}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-emerald-300 transition cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData[f.key]}
                        onChange={(e) => setFormData({ ...formData, [f.key]: e.target.checked })}
                        className="mt-1 w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{f.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-gradient-to-br from-white to-blue-50">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img src={imagePreview} alt="Preview" className="max-h-56 mx-auto rounded-xl shadow" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!editingId}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 mx-auto text-blue-500" />
                      <p className="text-gray-700 font-medium">Click to upload design image</p>
                      <p className="text-xs text-gray-500">PNG/JPG recommended</p>
                    </div>
                  </label>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-60"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Design' : 'Upload Design'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(false);
                    resetForm();
                  }}
                  className="flex-1 px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Design List */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Your Designs ({designs.length})</h2>

          {designs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-10 text-center">
              <p className="text-gray-600 mb-4">No designs yet. Start by uploading your first design.</p>
              <button
                onClick={toggleFormForNew}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
              >
                Upload Design
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {designs.map((design) => (
                <div
                  key={design._id}
                  className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={getImageUrl(design.imagePath || design.imageUrl)}
                      alt={design.modelName}
                      className="w-full h-52 object-cover bg-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/400x300?text=${encodeURIComponent(
                          design.modelName || 'Design'
                        )}`;
                      }}
                    />
                    <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-black/60 text-white">
                      {design.style || 'Style'}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-3 line-clamp-1">{design.modelName || 'Untitled Design'}</h3>

                    <div className="space-y-1.5 text-sm text-gray-700 mb-4">
                      <p className="flex items-center gap-2">
                        <IndianRupee size={15} className="text-emerald-600" />
                        ₹{Number(design.budgetMin || 0).toLocaleString()} - ₹
                        {Number(design.budgetMax || 0).toLocaleString()}
                      </p>
                      <p className="flex items-center gap-2">
                        <Ruler size={15} className="text-blue-600" />
                        {design.landSizeRequired} sq.ft
                      </p>
                      <p className="flex items-center gap-2">
                        <Building2 size={15} className="text-indigo-600" />
                        {design.bhk || 'N/A'} • {design.floors} Floor(s)
                      </p>
                      {design.location && (
                        <p className="flex items-center gap-2">
                          <MapPin size={15} className="text-rose-600" />
                          {design.location}
                        </p>
                      )}
                      {design.vastuCompliant && (
                        <p className="flex items-center gap-2 text-emerald-700">
                          <CheckCircle2 size={15} />
                          Vastu Compliant
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Quality features selected: <span className="font-semibold">{featureCount(design)}</span>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(design)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Edit2 size={15} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(design._id)}
                        className="flex-1 bg-red-600 text-white px-3 py-2.5 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}