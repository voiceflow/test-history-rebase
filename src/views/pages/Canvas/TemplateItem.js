import React, { Component } from 'react';

class TemplateItem extends Component {
    render() {
        // TODO: add hover popover for full template name
        var title = this.props.module.title;
        if(title.length > 11){
            title = title.substring(0, 8);
            title += "..."
        }
        return (
            <div
                className='MenuItem'
                onClick={() => {this.props.onTemplateChoice(this.props.module)}}
            >
                <div className="MenuIcon">
                    <img className="MenuIcon" src={this.props.module.module_icon} alt={this.props.module.title}/>
                </div>
                {title}
            </div>
        );
    }
}

export default TemplateItem;
