import React from 'react';
import Tracklist from '../Tracklist/Tracklist';
import './SearchResults.css';

function SearchResults({ tracks }) {
    return (
        <div className="SearchResults">
            <h2>Search Results</h2>
            <Tracklist tracks={tracks} />
        </div>
    );
}

export default SearchResults;
