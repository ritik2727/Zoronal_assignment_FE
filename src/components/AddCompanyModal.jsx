import { useState } from 'react';
import { createCompany } from '../services/api';
import crossIcon from '../assets/images/crossIcon.svg';
import grayLocationIcon from '../assets/images/grayLocationIcon.svg';
import grayCalenderIcon from '../assets/images/grayCalenderIcon.svg';

const INITIAL = { name: '', location: '', city: '', foundedOn: '' };

export default function AddCompanyModal({ onClose, onCreated }) {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.location || !form.city || !form.foundedOn) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await createCompany(form);
      onCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="add-company-title">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Decorative circles matching Figma */}
        <div className="ellipse-lavender" />
          {/* Ellipse front: magenta→purple gradient, cut off on left */}
        <div className="ellipse-gradient" />

        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <img src={crossIcon} alt="close icon" />
        </button>

        <h2 className="modal-title" id="add-company-title">Add Company</h2>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="company-name">Company Name</label>
            <input
              id="company-name"
              name="name"
              type="text"
              className="form-input"
              placeholder="Enter company name"
              value={form.name}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="form-group input-with-icon" style={{ position: 'relative' }}>
            <label className="form-label" htmlFor="company-location">Location</label>
            <input
              id="company-location"
              name="location"
              type="text"
              className="form-input"
              placeholder="Select Location"
              value={form.location}
              onChange={handleChange}
            />
             <img
              src={grayLocationIcon}
              alt="location"
              className="input-icon"
            />
          </div>

          <div className="form-group input-with-icon" style={{ position: 'relative' }}>
            <label className="form-label" htmlFor="company-founded">Founded On</label>
            <input
              id="company-founded"
              name="foundedOn"
              type="date"
              className="form-input "
              value={form.foundedOn}
              onChange={handleChange}
            />
            <img
              src={grayCalenderIcon}
              alt="calendar"
              className="input-icon"
            />

          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="company-city">City</label>
            <input
              id="company-city"
              name="city"
              type="text"
              className="form-input"
              placeholder="Enter city"
              value={form.city}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button
              id="save-company-btn"
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
