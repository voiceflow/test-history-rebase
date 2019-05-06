import React, { Component } from 'react';
import { connect } from 'react-redux'
import _ from 'lodash'
import { ListGroup, ListGroupItem } from "reactstrap";
import { setConfirm } from 'ducks/modal'
import { renameDiagram } from 'ducks/diagram';
import { v4 } from 'uuid'

import {UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu} from 'reactstrap'
class FlowBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: this.props.name? this.props.name : "Flow",
            edit: false,
            newFlowName: this.props.name ? this.props.name : "Flow",
        };
    }
    static getDerivedStateFromProps(props){
        return {
            name: props.name ? props.name: "Flow"
        };
    }

    generateFlowMenu = e => {
        e.stopPropagation();
        e.preventDefault();
        let engine = this.props.engine
        this.props.setBlockMenu(
            <>
                <div style={{ top: engine.getDiagramModel().getGridPosition(e.clientY - 155), left: engine.getDiagramModel().getGridPosition(e.clientX), cursor: 'pointer', position: 'absolute', zIndex: 10 }}>
                    <ListGroup>
                        <ListGroupItem onClick={() => {
                            this.props.setBlockMenu(null)
                            this.setState({
                                edit: true
                            })
                        }}>Rename Flow</ListGroupItem>
                    </ListGroup>
                </div>
            </>
        )
    }

    render(){
        return <React.Fragment>
            <button id="home-button" className="btn-home pl-3" onClick={()=>this.props.enterFlow(this.props.root_id)}>
                <span>Home</span>
            </button>
            <div id="flow-bar" className="text-center"
                onContextMenu={this.generateFlowMenu}
            >
                <div className="super-center px-5 w-100 no-select">
                    <div className="text-muted text-max w-100 px-5 mt-1">
                        <i className="flow-icon mr-3">&nbsp;&nbsp;&nbsp;&nbsp;</i>
                        { this.state.edit ?
                            <input
                                className='plain-input ml-2'
                                autoFocus
                                value={this.state.newFlowName}
                                onBlur={() => {
                                    this.setState({
                                        edit: false,
                                    })
                                    this.props.renameFlow(this.props.diagram, this.state.newFlowName)
                                }}
                                onKeyUp={e => {
                                    if (e.keyCode === 13){
                                        this.setState({
                                            edit: false,
                                        })
                                        this.props.renameFlow(this.props.diagram, this.state.newFlowName)
                                    }
                                }}
                                onChange={e => this.setState({
                                    newFlowName: e.target.value
                                })}
                            />
                        :this.state.name
                        }
                    </div>
                </div>
                <UncontrolledDropdown direction='up'>
                    <DropdownToggle className="dropdown-button position-absolute left mr-4 mt-1" tag="button" disabled={this.props.parentDiagrams.length === 0}>
                    <img src="/arrow-right.svg" alt="arrow" />
                    </DropdownToggle>
                    <DropdownMenu className="no-select">
                        {this.props.parentDiagrams.map(({id, name}) => (
                            <DropdownItem onClick={() => this.props.enterFlow(id)} className="pointer" key={v4()}>
                                {name === 'ROOT' ? 'Home' : name}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown direction='up'>
                    <DropdownToggle className="dropdown-button position-absolute right mr-4 mt-1" tag="button" disabled={this.props.childDiagrams.length === 0}>
                    <img src="/arrow-right.svg" alt="arrow" />
                    </DropdownToggle>
                    <DropdownMenu className="no-select">
                        {this.props.childDiagrams.map(({id, name}) => (
                            <DropdownItem onClick={() => this.props.enterFlow(id)} className="pointer" key={v4()}>
                                {name}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>
        </React.Fragment>
    }
}

const mapStateToProps = state => ({
  diagram: state.skills.skill.diagram,
  name: _.find(state.diagrams.diagrams, d => d.id === state.skills.skill.diagram) && _.find(state.diagrams.diagrams, d => d.id === state.skills.skill.diagram).name,
});

const mapDispatchToProps = dispatch => {
    return {
      setConfirm: confirm => dispatch(setConfirm(confirm)),
      renameFlow: (id, name) => dispatch(renameDiagram(id, name))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(FlowBar);