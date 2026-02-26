import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';
import { getDesignById } from '../services/designService';
import { getImageUrl } from '../services/api';

export default function DesignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDesign = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getDesignById(id);
        setDesign(res?.design || null);
      } catch (err) {
        setError(err?.message || 'Failed to load design details');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadDesign();
  }, [id]);

  const yesNo = (v) => (v ? 'Yes' : 'No');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-1 container-custom py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {loading && <p className="text-gray-600">Loading design...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && design && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{design.modelName || 'Home Design'}</h1>

            {/* High quality fresh-page image */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-3">
              <img
                src={getImageUrl(design.imagePath || design.imageUrl)}
                alt={design.modelName || 'Design'}
                className="w-full max-h-[82vh] object-contain rounded-xl bg-gray-100"
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/1400x900?text=${encodeURIComponent(
                    design.modelName || 'Design'
                  )}`;
                }}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 grid md:grid-cols-2 gap-4 text-sm">
              <p><strong>Style:</strong> {design.style || 'N/A'}</p>
              <p><strong>Floors:</strong> {design.floors ?? 'N/A'}</p>
              <p>
                <strong>Budget:</strong> ₹{Number(design.budgetMin || 0).toLocaleString()} - ₹
                {Number(design.budgetMax || 0).toLocaleString()}
              </p>
              <p><strong>Land Size:</strong> {design.landSizeRequired || 'N/A'} sq.ft</p>
              {design.location && (
                <p className="flex items-center gap-1">
                  <MapPin size={14} /> <strong>Location:</strong> {design.location}
                </p>
              )}
              <p><strong>Vastu Compliant:</strong> {yesNo(design.vastuCompliant)}</p>

              <p><strong>Soil Test & Structural Design:</strong> {yesNo(design.soilTestStructuralDesign)}</p>
              <p><strong>High-Grade Steel/Cement:</strong> {yesNo(design.highGradeSteelCement)}</p>
              <p><strong>Superior Waterproofing:</strong> {yesNo(design.superiorWaterproofing)}</p>
              <p><strong>Double Glazed + Insulation:</strong> {yesNo(design.doubleGlazedWindowsInsulation)}</p>
              <p><strong>Extra Electrical/Data Cabling:</strong> {yesNo(design.extraElectricalConduitsDataCabling)}</p>
              <p><strong>Proper Drainage System:</strong> {yesNo(design.properDrainageSystem)}</p>
            </div>

            {design.description && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700">{design.description}</p>
              </div>
            )}

            {design.architectId && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-3">Architect Contact</h2>
                <p><strong>Name:</strong> {design.architectId.name || 'N/A'}</p>
                {design.architectId.email && (
                  <p className="flex items-center gap-2">
                    <Mail size={14} /> <a className="text-blue-600 hover:underline" href={`mailto:${design.architectId.email}`}>{design.architectId.email}</a>
                  </p>
                )}
                {design.architectId.phone && (
                  <p className="flex items-center gap-2">
                    <Phone size={14} /> <a className="text-blue-600 hover:underline" href={`tel:${design.architectId.phone}`}>{design.architectId.phone}</a>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}