import React, { Component } from 'react';

class TutorialModal extends Component {
    render() {
        return (
            <div className='Moda'>
                <button onClick={this.props.onClose}>&times;</button>
                {Array.isArray(this.props.diagrams) ? this.props.diagrams.map(diagram => {
                    return <div key={diagram.id}><button onClick={() => this.props.onLoadId(diagram.id)}>{diagram.title ? diagram.title : diagram.id}</button></div>;
                }) : null}
            </div>
        );
    }
}

export default TutorialModal;
