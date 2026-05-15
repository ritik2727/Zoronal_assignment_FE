import { useState } from 'react';
import { createReview } from '../services/api';
import StarRating from './StarRating';

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
const INITIAL = { fullName: '', subject: '', reviewText: '', rating: 0 };

export default function AddReviewModal({ companyId, onClose, onCreated }) {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleRating = (val) => setForm((f) => ({ ...f, rating: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.subject || !form.reviewText) {
      setError('Full name, subject and review are required.');
      return;
    }
    if (!form.rating) {
      setError('Please select a rating.');
      return;
    }
    setLoading(true);
    try {
      const res = await createReview({ ...form, companyId });
      onCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="add-review-title">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
          {/* Decorative circles matching Figma */}
        <div className="ellipse-lavender" />
          {/* Ellipse front: magenta→purple gradient, cut off on left */}
        <div className="ellipse-gradient" />

        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <img src="../src/assets/images/crossIcon.svg" alt="close icon" />
        </button>

        <h2 className="modal-title" id="add-review-title">Add Review</h2>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="review-fullname">Full Name</label>
            <input 
              id="review-fullname"
              name="fullName"
              type="text"
              className="form-input"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="review-subject">Subject</label>
            <input
              id="review-subject"
              name="subject"
              type="text"
              className="form-input"
              placeholder="Review subject"
              value={form.subject}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="review-text">Enter Your Review</label>
            <textarea
              id="review-text"
              name="reviewText"
              className="form-input"
              placeholder="Share your experience..."
              value={form.reviewText}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label className="form-label text-[24px] font-semibold text-black" >
              Rating
              {form.rating > 0 && (
                <span className="rating-label-text"></span>
              )}
            </label>
            <div style={{ display: 'flex', alignItems: 'center',justifyContent:"space-between", gap: 8 }}>
              <StarRating value={form.rating} onChange={handleRating} size={35} />

              <span className='text-[14px] text-[#6B6B6B]'>{LABELS[form.rating]}</span>
            </div>
          </div>

          <div className="form-actions">
            <button
              id="save-review-btn"
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
