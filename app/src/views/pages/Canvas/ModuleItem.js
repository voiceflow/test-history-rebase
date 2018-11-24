import React, { Component } from 'react';

class ModuleItem extends Component {
    render() {
        // TODO: add popover for full module name
        var title = this.props.module.title;
        if(title.length > 11){
            title = title.substring(0, 8);
            title += "..."
        }
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
