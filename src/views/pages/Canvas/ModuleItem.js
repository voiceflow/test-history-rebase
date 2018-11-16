import React, { Component } from 'react';

class ModuleItem extends Component {
    render() {
        return (
            <div
                className='MenuItem'
                draggable={true}
                onDragStart={event => {
                    event.dataTransfer.setData('node', 'module');
                    event.dataTransfer.setData('data', JSON.stringify(this.props.module));
                }}
            >
                <div className="MenuIcon">
                    <img className="MenuIcon" src={this.props.module.module_icon} alt={this.props.module.title}/>
                </div>
                {this.props.module.title}
            </div>
        );
    }
}

export default ModuleItem;
