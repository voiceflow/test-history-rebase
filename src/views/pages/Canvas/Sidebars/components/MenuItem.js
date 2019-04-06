import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Tooltip} from 'react-tippy';
import { ALLOWED_GOOGLE_BLOCKS } from 'Constants'
import axios from 'axios'

class MenuItem extends Component {
    constructor(props){
        super(props)

        this.removeFlow = this.removeFlow.bind(this)
    }

    async removeFlow(){
        try{
            await axios.delete(`/marketplace/user_module/${this.props.project_id}/${this.props.item.module_id}`)
            // TODO: remove from flow bar
        } catch (err){
            console.log(err)
        }   
    }

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
                        window.Appcues.track('block dragged')
                        event.dataTransfer.setData('node', this.props.item.type);
                        if(this.props.data){
                            event.dataTransfer.setData('data', this.props.data)
                        }
                        if(this.props.name){
                            event.dataTransfer.setData('name', this.props.name)
                        }
                        if(this.props.item.diagram_id){
                            event.dataTransfer.setData('diagram_id', this.props.item.diagram_id)
                        }
                    }}
                >
                    <div className={"MenuIcon" + (this.props.item.type === 'symbol' ? ' module-icon' : '')}>
                        {this.props.item.icon}
                    </div>
                    <div className="MenuText">
                        <span>{this.props.item.text}</span> 
                        {this.props.draggable ?
                            this.props.item.diagram_id ?
                            <span className="delete-flow-icon" onClick={this.removeFlow}></span>
                            :
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
