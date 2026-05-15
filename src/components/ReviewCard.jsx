import { useState } from 'react';
import StarRating, { getAvatarColor, getInitials } from './StarRating';
import { likeReview } from '../services/api';

export default function ReviewCard({ review, onLiked }) {
  const { _id, fullName, subject, reviewText, rating, likes = 0, createdAt } = review;
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const date = createdAt
    ? new Date(createdAt).toLocaleDateString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      })
    : '';
  const time = createdAt
    ? new Date(createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : '';

  const handleLike = async (e) => {
    e.stopPropagation();
    if (liked) return;
    try {
      const res = await likeReview(_id);
      setLikeCount(res.data.likes);
      setLiked(true);
      if (onLiked) onLiked();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="review-card" id={`review-${_id}`}>
      <div
        className="reviewer-avatar"
        style={{ background: getAvatarColor(fullName) }}
        aria-label={`${fullName} avatar`}
      >
        <img src={`https://robohash.org/set=set2/${fullName}`} alt="user-image" /> 
      </div>
      <div className="review-body">
        <div className="review-header">
          <div>
            <div className="reviewer-name">{fullName}</div>
            <div className="review-meta">{date}{time ? `,  ${time}` : ''}</div>
          </div>
          <StarRating value={rating} size={18} />
        </div>
        {/* {subject && <div className="review-subject">{subject}</div>} */}
        <p className="review-text">{reviewText}</p>
        {/* <div className="review-actions">
          <button
            className={`like-btn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
            id={`like-btn-${_id}`}
            aria-label="Like this review"
            title={liked ? 'You liked this' : 'Like this review'}
          >
            {liked ? '❤️' : '🤍'} {likeCount > 0 ? likeCount : ''} Like
          </button>
          <button
            className="like-btn"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: `Review by ${fullName}`, text: reviewText });
              } else {
                navigator.clipboard?.writeText(window.location.href);
              }
            }}
            aria-label="Share this review"
          >
            🔗 Share
          </button>
        </div> */}
      </div>
    </div>
  );
}
