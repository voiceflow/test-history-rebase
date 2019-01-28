import React, { Component } from 'react';
import {Tooltip} from 'react-tippy';

class MenuItem extends Component {
    render() {
        return (
            <div className="wrap">
                <div
                    className={'MenuItem ' + this.props.item.type}
                    draggable={this.props.draggable}
                    onDragStart={event => {
                        event.dataTransfer.setData('node', this.props.item.type);
                        if(this.props.data){
                            event.dataTransfer.setData('data', this.props.data)
                        }
                        if(this.props.name){
                            event.dataTransfer.setData('name', this.props.name)
                        }
                    }}
                >
                    <div className="MenuIcon">
                        {this.props.item.icon}
                    </div>
                    <div className="MenuText">
                        <span>{this.props.item.text}</span>
                        <Tooltip 
                            html={this.props.item.tip}
                            className="menu-tip"
                            theme="menu"
                            position="bottom"
                        >
                            ?
                        </Tooltip>
                    </div>
                </div>
            </div>
    );
    }
}

export default MenuItem;
