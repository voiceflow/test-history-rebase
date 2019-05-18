import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {
    Input,
    InputGroup,
    ButtonGroup,
    InputGroupAddon,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap'
import { renameDiagram } from 'ducks/diagram'
import cn from 'classnames'

class FlowButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            name: props.diagram.name ? props.diagram.name : ''
        }

        this.close = this.close.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
          [event.target.name]: event.target.value
        });
    }

    close() {
        if (!this.props.preview){
            this.props.renameFlow(this.props.flow.id, this.state.name)
            this.setState({
                edit: false,
            });
        }
    }

    render() {
      if(!this.props.diagram) return null;

        let active = this.props.active === this.props.flow.id;
        return (
            this.state.edit ?
                <InputGroup className={cn("diagram-block", {"active": active})}>
                    <i className="flow-icon">&nbsp;&nbsp;&nbsp;&nbsp;</i>
                    <Input 
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                        onKeyPress={target => target.charCode === 13 ? this.close() : null}
                        onBlur={this.close}
                        autoFocus
                    />
                    <InputGroupAddon className="diagram-edit" addonType="append">
                        <i className="fas fa-edit"/>
                    </InputGroupAddon>
                </InputGroup>
                :
                <ButtonGroup className={cn("diagram-block", {"active" : active})}>
                    <button
                      className="diagram-button"
                      onClick={active ? null : ()=>this.props.enterFlow(this.props.flow.id)}
                    >
                        <i className="flow-icon mr-3 ">&nbsp;&nbsp;&nbsp;&nbsp;</i>
                        < span className="diagram-text" > {
                            this.props.flow.name === 'ROOT' ? 'HOME' : _.trim(this.props.diagram.name) ?
                                (this.props.diagram.name.length > 15 ? `${this.props.diagram.name.substring(0,15)}...` : this.props.diagram.name) : 'Flow'
                        } </span>
                    </button>
                    { (this.props.flow.name !== 'ROOT' && !this.props.preview) &&
                        <UncontrolledDropdown inNavbar>
                            <DropdownToggle className="diagram-edit" tag='button'>
                                <i className="fas fa-cog"/>
                            </DropdownToggle>
                            <DropdownMenu right className="arrow arrow-right no-select" style={{marginTop: -2}}>
                                <DropdownItem header>
                                    Flow Options
                                </DropdownItem>
                                <DropdownItem onClick={()=>this.setState({edit: true, name: this.props.diagram.name})} className="pointer">
                                     Edit Name
                                </DropdownItem>
                                <DropdownItem onClick={this.props.copyFlow} className="pointer">
                                     Copy
                                </DropdownItem>
                                <DropdownItem onClick={this.props.deleteFlow} className="pointer">
                                     Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    }
                </ButtonGroup>
        );
    }
}

const mapStateToProps = (state, props) => ({
    active: state.skills.skill.diagram,
    diagram: _.find(state.diagrams.diagrams, d => d.id === props.flow.id)
})

const mapDispatchToProps = dispatch => {
    return {
        renameFlow: (flow_id, name) => dispatch(renameDiagram(flow_id, name))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowButton);
