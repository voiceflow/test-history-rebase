import React, { Component } from 'react';

class Story extends Component {
    render() {
        return (
            <div>
                <h1>
                    <i className="fas fa-user"/>{' '}
                    <i className="far fa-long-arrow-right"/>{' '}
                    <i className="far fa-play-circle"/>
                </h1>
                <p className="text-muted">
                    Users begin here<br/> 
                    Connect this with another block
                </p>
            </div>
        );
    }
}

export default Story;
