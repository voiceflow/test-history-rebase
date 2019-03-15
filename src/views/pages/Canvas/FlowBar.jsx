import React, { Component } from 'react';
import { connect } from 'react-redux'
import _ from 'lodash'

import {UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu} from 'reactstrap'
class FlowBar extends Component{
    constructor(props){
        super(props);
        this.state = { name: this.props.name? this.props.name : "Flow" };
    }
    static getDerivedStateFromProps(props){
        return {
            name: props.name ? props.name: "Flow"
        };
    }
    render(){
        return <React.Fragment>
            <button id="home-button" className="btn-home pl-3" onClick={()=>this.props.enterFlow(this.props.root_id)}>
                <span>Home</span>
            </button>
            <div id="flow-bar">
                <div className="super-center px-5 w-100 no-select">
                    <div className="text-muted text-max w-100 px-5">
                        <i className="fas fa-clone mr-1"/> {this.state.name}
                    </div>
                </div>
                {!this.props.preview &&
                    <UncontrolledDropdown direction='up'>
                        <DropdownToggle className="grey-icon position-absolute right mr-4" tag="button">
                            <i className="far fa-ellipsis-h"/>
                        </DropdownToggle>
                        <DropdownMenu className="no-select">
                            <DropdownItem header>
                                Flow Options
                            </DropdownItem>
                            <DropdownItem onClick={() => this.props.copyFlow(this.props.diagram)} className="pointer">
                                <i className="fas fa-clone text-muted"/> Copy
                            </DropdownItem>
                            <DropdownItem onClick={() => this.props.deleteFlow(this.props.diagram)} className="pointer">
                                <i className="fas fa-times-square text-muted"/> Delete
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                }
            </div>
        </React.Fragment>
    }
}

const mapStateToProps = state => ({
  diagram: state.skills.skill.diagram,
  name: _.find(state.diagrams.diagrams, d => d.id === state.skills.skill.diagram) && _.find(state.diagrams.diagrams, d => d.id === state.skills.skill.diagram).name,
});
export default connect(mapStateToProps)(FlowBar);