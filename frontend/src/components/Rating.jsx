import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value = 0, text = '', color = '#f59e0b' }) => {
  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index} style={{ color }}>
          {value >= index ? (
            <FaStar />
          ) : value >= index - 0.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
        </span>
      ))}
      {text && <span className="rating-text">{text}</span>}
    </div>
  );
};

export default Rating;
