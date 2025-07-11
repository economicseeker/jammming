import React from 'react';
import Track from '../Track/Track';
import './Tracklist.css';

function Tracklist({ tracks, onAdd, onRemove, isRemoval }) {
    return (
        <div className="Tracklist" role="list" aria-label={isRemoval ? "Playlist tracks" : "Search results"}>
            {tracks.map(track => (
                <Track
                    key={track.id}
                    track={track}
                    onAdd={onAdd}
                    onRemove={onRemove}
                    isRemoval={isRemoval}
                />
            ))}
        </div>
    );
}

export default Tracklist;
