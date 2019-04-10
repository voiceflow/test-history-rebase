import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Tooltip} from 'react-tippy';
import { ALLOWED_GOOGLE_BLOCKS } from 'Constants'

class MenuItem extends Component {
    render() {

        let className = `MenuItem ${this.props.item.type}`
        if (this.props.platform === 'google' && !ALLOWED_GOOGLE_BLOCKS.includes(this.props.item.type)) {
            className = `${className} faded-node`
        }
        return (
            <div className="wrap" style={(!this.props.draggable) ? {opacity: 0.3} : null}>
                <div
                    className={className}
                    draggable={this.props.draggable}
                    onDragStart={event => {
                        event.stopPropagation()
                        window.Appcues.track('block dragged')
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
                        {this.props.draggable ?
                            <Tooltip 
                                html={this.props.item.tip}
                                className="menu-tip"
                                theme="menu"
                                position="bottom"
                            >
                                ?
                            </Tooltip>
                            : 
                            null
                        }
                    </div>
                </div>
            </div>
    );
    }
}

const mapStateToProps = state => ({
    platform: state.skills.skill.platform,
    project_id: state.skills.skill.project_id
})
export default connect(mapStateToProps)(MenuItem);
