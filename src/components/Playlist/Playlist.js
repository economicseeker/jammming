import React from 'react';
import Tracklist from '../Tracklist/Tracklist';
import './Playlist.css';

function Playlist({ playlistName, playlistTracks, onRemove, onNameChange, onSave }) {
    function handleNameChange(e) {
        onNameChange(e.target.value);
    }

    function handleSave() {
        onSave();
    }

    return (
        <div className="Playlist" role="region" aria-label="Playlist">
            <input 
                value={playlistName} 
                onChange={handleNameChange}
                aria-label="Playlist name"
                placeholder="Enter playlist name"
                maxLength={100}
            />
            <Tracklist
                tracks={playlistTracks}
                onRemove={onRemove}
                isRemoval={true}
            />
            <button 
                className="Playlist-save" 
                onClick={handleSave}
                aria-label="Save playlist to Spotify"
            >
                Save To Spotify
            </button>
        </div>
    );
}

export default Playlist;
