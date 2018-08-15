import React, { Component } from 'react';

class MenuItem extends Component {
    render() {
        return (
            <div
                className='MenuItem'
                draggable={true}
                onDragStart={event => {
                    event.dataTransfer.setData('node', JSON.stringify(this.props.item));
                }}
                style={{backgroundColor: this.props.item.menuColor}}
            >
                {this.props.item.text}
            </div>
        );
    }
}

export default MenuItem;
