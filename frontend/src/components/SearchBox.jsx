import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} style={{ display: 'flex', flex: 1, maxWidth: '500px' }}>
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search products..."
        className="form-control"
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderRight: 'none',
        }}
      />
      <button
        type="submit"
        className="btn btn-primary"
        style={{
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          padding: '0 1rem',
        }}
      >
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBox;
