import React from 'react';

const ModuleItem = (props) => {
        // TODO: add popover for full module name
    var title = props.module.title;
    if(title.length > 15){
        title = title.substring(0, 15);
        title += "..."
    }
    return (
        <div
            className='MenuItem'
            draggable={true}
            onDragStart={event => {
                event.dataTransfer.setData('node', 'module');
                event.dataTransfer.setData('data', JSON.stringify(props.module));
            }}
        >
            <div className="MenuIcon">
                <img className="MenuIcon" src={props.module.module_icon} alt={props.module.title}/>
            </div>
            {title}
        </div>
    );
}

export default ModuleItem;
