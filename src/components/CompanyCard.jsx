import { useNavigate } from 'react-router-dom';
import StarRating, { getAvatarColor, getInitials } from './StarRating';
import companyLogo from '../assets/images/companyLogo.svg';

export default function CompanyCard({ company }) {
  const navigate = useNavigate();
  const { _id, name, location, city, foundedOn, avgRating = 0, reviewCount = 0 } = company;

  const formattedDate = foundedOn
    ? new Date(foundedOn).toLocaleDateString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
    : '—';

  return (
    <div
      className="company-card"
      onClick={() => navigate(`/company/${_id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/company/${_id}`)}
      id={`company-card-${_id}`}
    >
      <div className="company-card-header">
        <div
          aria-label={`${name} logo`}
          className='h-[100px] w-[105.28px]'
        >
          <img src={companyLogo} alt={name} />
        </div>

        <div className='flex flex-col flex-1'>
          <div className="company-info">
            <div className="company-name">{name}</div>
            <div className="company-founded">Founded on {formattedDate}</div>
          </div>




          <div className="company-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span>{location}{city ? `, ${city}` : ''}</span>
          </div>

          <div className="company-card-footer">
            <div className="rating-row">
              <span className="rating-number">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</span>
              <StarRating value={Math.round(avgRating)} size={16} />
              <span className="review-count">{reviewCount} Review{reviewCount !== 1 ? 's' : ''}</span>
            </div>
            <button
              className="btn btn-gradient "
              style={{background:"#303030",padding:"7px 22px"}}
              onClick={(e) => { e.stopPropagation(); navigate(`/company/${_id}`); }}
              id={`detail-btn-${_id}`}
            >
              Detail Review
            </button>
          </div>
        </div>

      </div>


    </div>
  );
}
