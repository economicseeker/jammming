import React from 'react';
import Track from '../Track/Track';
import './Tracklist.css';

function Tracklist({ tracks, isRemoval }) {
    return (
        <div className="Tracklist">
            {tracks.map((track) => (
                <Track key={track.id} track={track} isRemoval={isRemoval} />
            ))}
        </div>
    );
}

export default Tracklist;
