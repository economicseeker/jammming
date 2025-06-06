import React from 'react';
import './Track.css';

function Track({ track, onAdd, onRemove, isRemoval }) {
    function handleAdd() {
        onAdd(track);
    }

    function handleRemove() {
        onRemove(track);
    }

    return (
        <div className="Track" role="listitem">
            <div className="Track-information">
                <h3>{track.name}</h3>
                <p>{track.artist} | {track.album}</p>
            </div>
            {isRemoval ? (
                <button 
                    className="Track-action" 
                    onClick={handleRemove}
                    aria-label={`Remove ${track.name} from playlist`}
                >
                    -
                </button>
            ) : (
                <button 
                    className="Track-action" 
                    onClick={handleAdd}
                    aria-label={`Add ${track.name} to playlist`}
                >
                    +
                </button>
            )}
        </div>
    );
}

export default Track;
