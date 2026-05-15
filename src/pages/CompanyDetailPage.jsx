import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompanyById } from '../services/api';
import { getReviews } from '../services/api';
import StarRating, { getAvatarColor, getInitials } from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';
import AddReviewModal from '../components/AddReviewModal';
import companyLogo from '../assets/images/companyLogo.svg';

const SORT_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'rating', label: 'Rating' },
  { value: 'relevance', label: 'Relevance (Likes)' },
];

export default function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [sort, setSort] = useState('date');
  const [showAddReview, setShowAddReview] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch company
  useEffect(() => {
    setLoadingCompany(true);
    getCompanyById(id)
      .then((res) => setCompany(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoadingCompany(false));
  }, [id, navigate]);

  // Fetch reviews
  const fetchReviews = useCallback(() => {
    setLoadingReviews(true);
    getReviews(id, { sort })
      .then((res) => {
        setReviews(res.data.reviews);
        setAvgRating(res.data.avgRating);
        setReviewCount(res.data.count);
      })
      .catch(console.error)
      .finally(() => setLoadingReviews(false));
  }, [id, sort]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleReviewCreated = () => {
    setShowAddReview(false);
    fetchReviews();
    showToast('✅ Review submitted successfully!');
  };

  if (loadingCompany) {
    return <div className="loading-spinner" style={{ minHeight: '60vh' }}><div className="spinner" /></div>;
  }

  if (!company) return null;



  const formattedFounded = company.foundedOn
    ? new Date(company.foundedOn).toLocaleDateString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
    : '—';

  return (
    <>
      <div className="page-container">
        {/* Back button */}
        <button className="back-btn" onClick={() => navigate('/')} id="back-btn">
          Back to Companies
        </button>

         <hr className='border-[rgba(236, 236, 236, 1)] mt-[28px] mb-[28px] -mr-[65px] -ml-[65px]' />

        {/* Company Hero Card */}
        <div className="detail-hero">
          <div className="company-card-header">
            <div
              aria-label={`${company?.name} logo`}
              className='h-[100px] w-[105.28px]'
            >
              <img src={companyLogo} alt={company?.name} />
            </div>

            <div className='flex flex-col flex-1'>
              <div className="company-info">
                <div className="company-name">{company?.name}</div>
                <div className="company-founded">Founded on {formattedFounded}</div>
              </div>
              <div className="company-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <span>{company?.location}{company?.city ? `, ${company?.city}` : ''}</span>
              </div>

              <div className="company-card-footer">
                <div className="rating-row">
                  <span className="rating-number">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</span>
                  <StarRating value={Math.round(avgRating)} size={16} />
                  <span className="review-count">{reviewCount} Review{reviewCount !== 1 ? 's' : ''}</span>
                </div>
                <button
                  id="add-review-btn"
                  className="btn btn-gradient"
                  onClick={() => setShowAddReview(true)}
                >
                  + Add Review
                </button>
              </div>
            </div>

          </div>
          <hr className='border-[#ECECEC] mt-[24px]' />

          <div>

            <div className="detail-toolbar">
               <p className="results-count" style={{ marginRight: 'auto' }}>
                Result Found: <span>{reviewCount}</span>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="toolbar-label">Sort:</span>
                <select
                  id="review-sort-select"
                  className="toolbar-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort reviews"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

             


            </div>

            {loadingReviews ? (
              <div className="loading-spinner"><div className="spinner" /></div>
            ) : reviews.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <div className="empty-title">No reviews yet</div>
                <div className="empty-sub">Be the first to share your experience!</div>
                <button
                  className="btn btn-gradient"
                  style={{ marginTop: 16 }}
                  onClick={() => setShowAddReview(true)}
                >
                  + Add Review
                </button>
              </div>
            ) : (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} onLiked={fetchReviews} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review Toolbar */}


        {/* Reviews List */}

      </div>

      {/* Add Review Modal */}
      {showAddReview && (
        <AddReviewModal
          companyId={id}
          onClose={() => setShowAddReview(false)}
          onCreated={handleReviewCreated}
        />
      )}

      {/* Toast */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
