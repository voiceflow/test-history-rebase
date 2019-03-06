import React from 'react'

export const Spinner = ({name}) => {
return (
    <div id="loading-diagram">
        <div className="text-center">
            <h5 className="text-muted mb-2">{`Loading ${name}`}</h5>
            <span className="loader"/>
        </div>
    </div>
)}