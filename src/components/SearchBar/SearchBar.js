import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <div className="SearchBar">
            <form onSubmit={handleSearch}>
                <input 
                    placeholder="Enter a song, album, or artist" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">SEARCH</button>
            </form>
        </div>
    );
}

export default SearchBar;
