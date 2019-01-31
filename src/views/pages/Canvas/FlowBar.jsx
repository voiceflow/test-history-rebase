import React, { Component } from 'react';
import {UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu} from 'reactstrap'
class FlowBar extends Component{
    constructor(props){
        super(props);
        this.state = { name: this.props.diagram ? this.props.diagram.name : "Flow" };
    }
    static getDerivedStateFromProps(props){
        return {
            name: props.diagram ? props.diagram.name : "Flow"
        };
    }
    render(){
        return <React.Fragment>
            <button id="home-button" className="btn btn-clear exit pl-3" onClick={()=>this.props.enterFlow(this.props.skill.diagram)}>
                <i className="fas fa-chevron-left mr-1"/> <span>Home</span>
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
                            <DropdownItem onClick={() => this.props.copyFlow(this.props.diagram.id)} className="pointer">
                                <i className="fas fa-clone text-muted"/> Copy
                            </DropdownItem>
                            <DropdownItem onClick={() => this.props.deleteFlow(this.props.diagram.id)} className="pointer">
                                <i className="fas fa-times-square text-muted"/> Delete
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                }
            </div>
        </React.Fragment>
    }
}
export default FlowBar;