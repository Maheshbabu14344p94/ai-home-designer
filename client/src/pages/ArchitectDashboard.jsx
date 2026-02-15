import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Upload, Edit2, Trash2, AlertCircle, Phone } from 'lucide-react';
import { uploadDesign, getArchitectDesigns, updateDesign, deleteDesign } from '../services/designService';
import { getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ArchitectDashboard() {
  const { user } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    modelName: '',
    style: 'Modern',
    floors: 1,
    budgetMin: '',
    budgetMax: '',
    landSizeRequired: '',
    vastuCompliant: false,
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const response = await getArchitectDesigns();
      setDesigns(response.designs);
    } catch (err) {
      setError('Failed to fetch designs');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!imageFile && !editingId) {
      setError('Please select an image');
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingId) {
        await updateDesign(editingId, data);
        setSuccess('Design updated successfully!');
      } else {
        await uploadDesign(data);
        setSuccess('Design uploaded successfully!');
      }

      // Reset form
      setFormData({
        modelName: '',
        style: 'Modern',
        floors: 1,
        budgetMin: '',
        budgetMax: '',
        landSizeRequired: '',
        vastuCompliant: false,
        description: '',
      });
      setImageFile(null);
      setImagePreview('');
      setEditingId(null);
      setShowUploadForm(false);
      fetchDesigns();
    } catch (err) {
      setError(err.message || 'Failed to save design');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (design) => {
    setFormData({
      modelName: design.modelName,
      style: design.style,
      floors: design.floors,
      budgetMin: design.budgetMin,
      budgetMax: design.budgetMax,
      landSizeRequired: design.landSizeRequired,
      vastuCompliant: design.vastuCompliant,
      description: design.description,
    });
    setImagePreview(getImageUrl(design.imagePath || design.imageUrl));
    setEditingId(design._id);
    setShowUploadForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this design?')) {
      try {
        await deleteDesign(id);
        setSuccess('Design deleted successfully!');
        fetchDesigns();
      } catch (err) {
        setError('Failed to delete design');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 container-custom py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Architect Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
            {user?.phone && (
              <p className="text-gray-600 flex items-center gap-2 mt-2">
                <Phone size={16} /> {user.phone} (Visible to users)
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setShowUploadForm(!showUploadForm);
              setEditingId(null);
              setFormData({
                modelName: '',
                style: 'Modern',
                floors: 1,
                budgetMin: '',
                budgetMax: '',
                landSizeRequired: '',
                vastuCompliant: false,
                description: '',
              });
              setImagePreview('');
              setImageFile(null);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Upload size={20} /> New Design
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {showUploadForm && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Design' : 'Upload New Design'}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Model Name"
                  value={formData.modelName}
                  onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <select
                  value={formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>Modern</option>
                  <option>Traditional</option>
                  <option>Contemporary</option>
                  <option>Minimalist</option>
                  <option>Rustic</option>
                  <option>Colonial</option>
                </select>

                <input
                  type="number"
                  placeholder="Number of Floors"
                  value={formData.floors}
                  onChange={(e) => setFormData({ ...formData, floors: parseInt(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <input
                  type="number"
                  placeholder="Land Size Required (sq.ft)"
                  value={formData.landSizeRequired}
                  onChange={(e) => setFormData({ ...formData, landSizeRequired: parseInt(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <input
                  type="number"
                  placeholder="Budget Min (₹)"
                  value={formData.budgetMin}
                  onChange={(e) => setFormData({ ...formData, budgetMin: parseInt(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <input
                  type="number"
                  placeholder="Budget Max (₹)"
                  value={formData.budgetMax}
                  onChange={(e) => setFormData({ ...formData, budgetMax: parseInt(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 h-24"
              />

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vastuCompliant}
                  onChange={(e) => setFormData({ ...formData, vastuCompliant: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Vastu Compliant</span>
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!editingId}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="text-gray-600">Drag and drop your image here or click to browse</p>
                    </div>
                  </label>
                )}
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Saving...' : editingId ? 'Update Design' : 'Upload Design'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-6">Your Designs ({designs.length})</h2>
          {designs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 mb-4">No designs yet. Start by uploading your first design!</p>
              <button
                onClick={() => setShowUploadForm(true)}
                className="btn-primary"
              >
                Upload Design
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design) => (
                <div
                  key={design._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={getImageUrl(design.imagePath || design.imageUrl)}
                    alt={design.modelName}
                    className="w-full h-48 object-cover bg-gray-200"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=' + design.modelName;
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{design.modelName}</h3>
                    <p className="text-sm text-gray-600 mb-2">{design.style}</p>
                    <div className="text-sm text-gray-700 mb-4 space-y-1">
                      <p>💰 ₹{design.budgetMin.toLocaleString()} - ₹{design.budgetMax.toLocaleString()}</p>
                      <p>📏 {design.landSizeRequired} sq.ft</p>
                      <p>🏢 {design.floors} Floor(s)</p>
                      {design.vastuCompliant && <p>✅ Vastu Compliant</p>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(design)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(design._id)}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} /> Delete
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