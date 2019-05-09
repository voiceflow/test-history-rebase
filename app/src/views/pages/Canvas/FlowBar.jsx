import React, { Component } from 'react';
import { connect } from 'react-redux'
import _ from 'lodash'
import { ListGroup, ListGroupItem } from "reactstrap";
import { setConfirm } from 'ducks/modal'
import { renameDiagram } from 'ducks/diagram';
import { v4 } from 'uuid'
import './FlowBar.css'
import cn from 'classnames'

import {Dropdown, DropdownToggle, DropdownItem, DropdownMenu} from 'reactstrap'
class FlowBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: this.props.name? this.props.name : "Flow",
            edit: false,
            newFlowName: this.props.name ? this.props.name : "Flow",
            leftDropdownOpen: false,
            rightDropdownOpen: false
        };
    }
    static getDerivedStateFromProps(props){
        return {
            name: props.name ? props.name: "Flow"
        };
    }

    toggle = side => {
        if (side === "left")
            this.setState({
                leftDropdownOpen: !this.state.leftDropdownOpen
            })
        else {
            this.setState({
                rightDropdownOpen: !this.state.rightDropdownOpen
            })
        }
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
                <Dropdown direction='up' isOpen={this.state.leftDropdownOpen} toggle={() => this.toggle("left")}>
                    <DropdownToggle 
                        className="dropdown-button mt-1 pl-3 previous" 
                        tag="button" 
                        disabled={this.props.parentDiagrams.length === 0}>
                    <img src="/arrow-left-hover.svg" alt="arrow" className={cn("flow-arrow", {"active": this.state.leftDropdownOpen})} />
                    </DropdownToggle>
                    <DropdownMenu  className="no-select">
                        {this.props.parentDiagrams.map(({id, name}) => (
                            <DropdownItem onClick={() => this.props.enterFlow(id)} className="pointer" key={v4()}>
                                {name === 'ROOT' ? 'Home' : name}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
                <Dropdown direction='up' isOpen={this.state.rightDropdownOpen} toggle={() => this.toggle("right")}>
                    <DropdownToggle 
                        className="dropdown-button mr-4 pl-3 mt-1" 
                        tag="button" 
                        disabled={this.props.childDiagrams.length === 0}>
                    <img src="/arrow-right-hover.svg" alt="arrow" className={cn("flow-arrow", {"active": this.state.rightDropdownOpen})}/>
                    </DropdownToggle>
                    <DropdownMenu className="no-select">
                        {this.props.childDiagrams.map(({id, name}) => (
                            <DropdownItem onClick={() => this.props.enterFlow(id)} className="pointer" key={v4()}>
                                {name}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>
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