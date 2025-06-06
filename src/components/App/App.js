import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify'; // Adjust if your folder structure differs

function App() {
    const [searchResults, setSearchResults] = useState([
        {
            id: 1,
            name: 'Lose Yourself',
            artist: 'Eminem',
            album: '8 Mile',
            uri: 'spotify:track:1uZkxN9dW6slhaCrPCC3Ff',
        },
        {
            id: 2,
            name: 'Levitating',
            artist: 'Dua Lipa',
            album: 'Future Nostalgia',
            uri: 'spotify:track:463CkQjx2Zk1yXoBuierM9',
        },
        {
            id: 3,
            name: 'Blinding Lights',
            artist: 'The Weeknd',
            album: 'After Hours',
            uri: 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b',
        },
    ]);

    const [playlistName, setPlaylistName] = useState('New Playlist');

    const [playlistTracks, setPlaylistTracks] = useState([
        {
            id: 4,
            name: 'Peaches',
            artist: 'Justin Bieber',
            album: 'Justice',
            uri: 'spotify:track:4iJyoBOLtHqaGxP12qzhQI',
        },
        {
            id: 5,
            name: 'good 4 u',
            artist: 'Olivia Rodrigo',
            album: 'SOUR',
            uri: 'spotify:track:4ZtFanR9U6ndgddUvNcjcG',
        },
    ]);

    // ✅ Handle PKCE-based Spotify authentication on mount
    useEffect(() => {
        Spotify.getAccessToken()
            .then((token) => {
                console.log('Spotify Access Token:', token);
                // Store if needed, or just keep logging for now
            })
            .catch((error) => {
                console.error('Error fetching access token:', error);
            });
    }, []);

    function addTrack(track) {
        if (playlistTracks.find(savedTrack => savedTrack.id === track.id)) return;
        setPlaylistTracks(prev => [...prev, track]);
    }

    function removeTrack(track) {
        setPlaylistTracks(prev =>
            prev.filter(savedTrack => savedTrack.id !== track.id)
        );
    }

    function updatePlaylistName(name) {
        setPlaylistName(name);
    }

    function savePlaylist() {
        const trackUris = playlistTracks.map(track => track.uri);
        console.log('Saving playlist to Spotify with URIs:', trackUris);

        // Placeholder — actual API call will come in Task 10
        setPlaylistName('New Playlist');
        setPlaylistTracks([]);
    }

    return (
        <div className="App">
            <h1>Jammming 🎧</h1>
            <SearchBar />
            <div className="App-playlist">
                <SearchResults tracks={searchResults} onAdd={addTrack} />
                <Playlist
                    playlistName={playlistName}
                    playlistTracks={playlistTracks}
                    onRemove={removeTrack}
                    onNameChange={updatePlaylistName}
                    onSave={savePlaylist}
                />
            </div>
        </div>
    );
}

export default App;
