import React, { Component } from 'react';

class MenuItem extends Component {
    render() {
        return (
            <div
                className={'MenuItem ' + this.props.item.type}
                draggable={true}
                onDragStart={event => {
                    event.dataTransfer.setData('node', this.props.item.type);
                }}
            >
                <div className="MenuIcon">
                    {this.props.item.icon}
                </div>
                {this.props.item.text}
            </div>
        );
    }
}

export default MenuItem;
