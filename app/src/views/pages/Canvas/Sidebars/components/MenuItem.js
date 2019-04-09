import React, { Component } from 'react';
import { connect } from 'react-redux'
import {Tooltip} from 'react-tippy';
import { ALLOWED_GOOGLE_BLOCKS } from 'Constants'
import axios from 'axios'
import { removeUserModules } from './../../../../../actions/versionActions'
import { replaceDiagrams } from './../../../../../actions/diagramActions'

class MenuItem extends Component {
    constructor(props){
        super(props)

        this.removeFlow = this.removeFlow.bind(this)
    }

    async removeFlow(){
        try{
            // Delete on backend first
            await axios.delete(`/marketplace/user_module/${this.props.project_id}/${this.props.item.module_id}`)
            this.props.removeUserModules(this.props.item.module_id)

            // // Removing that flow's diagrams if they're unlinked
            let module_diagram_id = this.props.item.diagram_id
            let diagrams_to_delete = new Set()
            let diagrams_to_keep = new Set()
            let sub_diagrams = {}
            let diagrams = {}

            // Generating the sub_diagrams + diagrams objects
            for(let diagram of this.props.diagrams){
                diagrams[diagram.id] = diagram
                for(let sub_diagram of diagram.sub_diagrams){
                    // Store this sub diagram's parents so we have ez access in the future
                    if(sub_diagrams[sub_diagram] !== undefined){
                        sub_diagrams[sub_diagram].push(diagram.id)
                    } else {
                        sub_diagrams[sub_diagram] = [diagram.id]
                    }
                }
            }

            // BFSes and sets flows in its path to keep
            const setToKeepBFS = (root_id) => {
                let keep_queue = [root_id]
                while (keep_queue.length > 0){
                    let curr_diagram_id = keep_queue.shift()
                    if(!diagrams_to_keep.has(curr_diagram_id)){
                        diagrams_to_keep.add(curr_diagram_id)
                        diagrams_to_delete.delete(curr_diagram_id)
                        keep_queue = keep_queue.concat(diagrams[curr_diagram_id].sub_diagrams)
                    }
                }
            }

            // Traverse the module's diagrams, checking whether they should be deleted
            let queue = [module_diagram_id]
            while (queue.length > 0) {
                let curr_diagram_id = queue.shift()
                if(!diagrams_to_keep.has(curr_diagram_id) && !diagrams_to_delete.has(curr_diagram_id)){
                    queue = queue.concat(diagrams[curr_diagram_id].sub_diagrams)
                    // Delete if the diagram is not linked or it is a sub diagram and all of its parent has been visited and marked for deletion
                    if(sub_diagrams[curr_diagram_id] !== undefined && 
                    sub_diagrams[curr_diagram_id].filter((parent_diagram_id) => diagrams[parent_diagram_id].module_id !== this.props.item.module_id).length > 0){
                        setToKeepBFS(curr_diagram_id)
                    } else {
                        diagrams_to_delete.add(curr_diagram_id)
                    }
                }
            }

            // Update diagrams
            let new_diagrams = []
            for(let diagram of this.props.diagrams){
                if(!diagrams_to_delete.has(diagram.id)){
                    // Check whether any of its sub diagrams were deleted just in case
                    diagram.sub_diagrams = diagram.sub_diagrams.filter((diagram_id) => {return !diagrams_to_delete.has(diagram_id)})
                    new_diagrams.push(diagram)
                }
            }

            // Delete these diagrams off backend then frontend
            for(let diagram_id of Array.from(diagrams_to_delete)){
                await axios.delete(`/diagram/${diagram_id}`)
            }
            this.props.replaceDiagrams(new_diagrams)
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
                        event.stopPropagation()
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
    project_id: state.skills.skill.project_id,
    diagrams: state.diagrams.diagrams
})

const mapDispatchToProps = dispatch => {
    return {
      removeUserModules: (module_id) => dispatch(removeUserModules(module_id)),
      replaceDiagrams: (diagrams) => dispatch(replaceDiagrams(diagrams))
    }
  }
export default connect(mapStateToProps, mapDispatchToProps)(MenuItem);
