import React from 'react';
import Tracklist from '../Tracklist/Tracklist';
import './Playlist.css';

function Playlist({ tracks }) {
    return (
        <div className="Playlist">
            <input defaultValue="New Playlist" />
            <Tracklist tracks={tracks} isRemoval={true} />
            <button>Save To Spotify</button>
        </div>
    );
}

export default Playlist;
