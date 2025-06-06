import React from 'react';
import Tracklist from '../Tracklist/Tracklist';
import './Playlist.css';

function Playlist({ playlistName, playlistTracks, onRemove, onNameChange }) {
    function handleNameChange(e) {
        onNameChange(e.target.value);
    }

    return (
        <div className="Playlist">
            <input value={playlistName} onChange={handleNameChange} />
            <Tracklist
                tracks={playlistTracks}
                onRemove={onRemove}
                isRemoval={true}
            />
            <button className="Playlist-save">Save To Spotify</button>
        </div>
    );
}



export default Playlist;
