import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

function App() {
    const [searchResults, setSearchResults] = useState([]);
    const [playlistName, setPlaylistName] = useState('New Playlist');
    const [playlistTracks, setPlaylistTracks] = useState([]);

    useEffect(() => {
        Spotify.getAccessToken()
            .then((token) => {
                console.log('Spotify Access Token:', token);
            })
            .catch((error) => {
                console.error('Error fetching access token:', error);
            });
    }, []);

    const search = async (term) => {
        try {
            const results = await Spotify.search(term);
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching tracks:', error);
            setSearchResults([]);
        }
    };

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

    async function savePlaylist() {
        const trackUris = playlistTracks.map(track => track.uri);
        try {
            await Spotify.savePlaylist(playlistName, trackUris);
            setPlaylistName('New Playlist');
            setPlaylistTracks([]);
        } catch (error) {
            console.error('Error saving playlist:', error);
        }
    }

    return (
        <div className="App">
            <h1>Jammming 🎧</h1>
            <SearchBar onSearch={search} />
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
