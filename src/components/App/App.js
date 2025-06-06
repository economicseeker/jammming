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
    const [playlistName, setPlaylistName] = useState("New Playlist");
    const [playlistTracks, setPlaylistTracks] = useState([
        {
            id: 4,
            name: "Peaches",
            artist: "Justin Bieber",
            album: "Justice",
        },
        {
            id: 5,
            name: "good 4 u",
            artist: "Olivia Rodrigo",
            album: "SOUR",
        }
    ]);

    return (
        <div className="App">
            <h1>Jammming 🎧</h1>
            <SearchBar />
            <div className="App-playlist">
                <SearchResults tracks={searchResults} />
                <Playlist
                    playlistName={playlistName}
                    playlistTracks={playlistTracks}
                />
            </div>
        </div>
    );
}

export default App;