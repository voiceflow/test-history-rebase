import React, { Component } from 'react';
import {Tooltip} from 'react-tippy';

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
                <div className="MenuText">
                    <span>{this.props.item.text}</span>
                    <Tooltip 
                        html={<div style={{ width: 165 }}>{this.props.item.tip}</div>} 
                        className="menu-tip"
                        position="bottom"
                    >
                        ?
                    </Tooltip>
                </div>
            </div>
    );
    }
}

export default MenuItem;
