import React, { useState } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

function App() {
    const [searchResults, setSearchResults] = useState([
        {
            id: 1,
            name: 'Lose Yourself',
            artist: 'Eminem',
            album: '8 Mile',
        },
        {
            id: 2,
            name: 'Levitating',
            artist: 'Dua Lipa',
            album: 'Future Nostalgia',
        },
        {
            id: 3,
            name: 'Blinding Lights',
            artist: 'The Weeknd',
            album: 'After Hours',
        },
    ]);

    return (
        <div className="App">
            <h1>Jammming 🎧</h1>
            <SearchBar />
            <div className="App-playlist">
                <SearchResults tracks={searchResults} />
                <Playlist tracks={searchResults} />
            </div>
        </div>
    );
}

export default App;