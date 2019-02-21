import React, { Component } from 'react'
import _ from 'lodash'
import { 
    Button, 
    Input, 
    InputGroup, 
    ButtonGroup, 
    InputGroupAddon,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem 
} from 'reactstrap'

class FlowButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
            edit: false,
            name: props.flow ? props.flow.name : ''
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

        let active = this.props.active === this.props.flow.id;

        return (
            this.state.edit ? 
                <InputGroup className="diagram-block">
                    <Input 
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange}
                        autoFocus
                    />
                    <InputGroupAddon addonType="append">
                        <Button className="diagram-edit" 
                                onClick={this.close}>
                            <i className="fas fa-edit"/>
                        </Button> 
                    </InputGroupAddon>
                </InputGroup>
                :
                <ButtonGroup className="diagram-block">
                    <Button disabled={active} 
                        onClick={active ? null : ()=>this.props.enterFlow(this.props.flow.id)} block>
                        < span className = "diagram-text" > {
                            this.props.flow.name === 'ROOT' ? 'HOME' : _.trim(this.state.name) ?
                                (this.state.name.length > 15 ? `${this.state.name.substring(0,15)}...` : this.state.name) : 'Flow'
                        } </span>
                    </Button>
                    { (this.props.flow.name !== 'ROOT' && !this.props.preview) && 
                        <UncontrolledDropdown inNavbar>
                            <DropdownToggle className="diagram-edit append">
                                <i className="fas fa-cog"/>
                            </DropdownToggle>
                            <DropdownMenu right className="arrow arrow-right no-select" style={{right: '-2px', marginTop: '4px'}}>
                                <DropdownItem header>
                                    Flow Options
                                </DropdownItem>
                                <DropdownItem onClick={()=>this.setState({edit: true, name: this.props.flow.name})} className="pointer">
                                    <i className="fas fa-edit text-muted"/> Edit Name
                                </DropdownItem>
                                <DropdownItem onClick={this.props.copyFlow} className="pointer">
                                    <i className="fas fa-clone text-muted"/> Copy
                                </DropdownItem>
                                <DropdownItem onClick={this.props.deleteFlow} className="pointer">
                                    <i className="fas fa-times-square text-muted"/> Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown> 
                    }
                </ButtonGroup>
        );
    }
}

export default FlowButton;
