import React, { Component } from 'react';
import {Tooltip} from 'react-tippy';
import { ALLOWED_GOOGLE_BLOCKS } from '../../Constants'

class MenuItem extends Component {
    render() {

        let className = `MenuItem ${this.props.item.type}`
        if (this.props.platform === 'google' && !ALLOWED_GOOGLE_BLOCKS.includes(this.props.item.type)) {
            className = `${className} faded-node`
        }

        return (
            <div className="wrap">
                <div
                    className={className}
                    draggable={true}
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
