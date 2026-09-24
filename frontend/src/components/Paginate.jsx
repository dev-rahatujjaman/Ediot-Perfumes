import React from 'react';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  if (pages <= 1) return null;

  return (
    <ul className="pagination">
      {[...Array(pages).keys()].map((x) => (
        <li key={x + 1} className={`page-item ${x + 1 === page ? 'active' : ''}`}>
          <Link
            className="page-link"
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/products/page/${x + 1}`
            }
          >
            {x + 1}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Paginate;
