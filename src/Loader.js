import React, { Component } from 'react';

class Loader extends Component {
    render() {
        return (
            <div className='Loader'>
                <button onClick={this.props.onClose}>&times;</button>
                {this.props.diagrams.map((diagram) => {
                    return <div key={diagram.id}><button onClick={() => this.props.onLoadId(diagram.id)}>{diagram.title ? diagram.title : diagram.id}</button></div>;
                })}
            </div>
        );
    }
}

export default Loader;
