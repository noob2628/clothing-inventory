// src/app/components/SearchBar.js
'use client';
import { useState } from 'react';
import { InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

export default function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(term);
  };

  const handleClear = () => {
    setTerm('');
    onSearch('');
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center border rounded-full overflow-hidden">
          <IconButton type="submit" className="text-gray-500">
            <SearchIcon />
          </IconButton>
          <InputBase
            placeholder="Search products..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-64 px-2"
          />
          {term && (
            <IconButton onClick={handleClear} className="text-gray-500">
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </form>
    </div>
  );
}