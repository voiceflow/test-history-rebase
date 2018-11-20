import React, { Component } from 'react';

class TemplateItem extends Component {
    render() {
        return (
            <div
                className='MenuItem'
                onClick={() => {this.props.onTemplateChoice(this.props.module)}}
            >
                <div className="MenuIcon">
                    <img className="MenuIcon" src={this.props.module.module_icon} alt={this.props.module.title}/>
                </div>
                {this.props.module.title}
            </div>
        );
    }
}

export default TemplateItem;
