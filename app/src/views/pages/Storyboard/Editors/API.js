import React, { Component } from 'react';
import { Nav, NavItem, NavLink, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import APIInputs from './components/APIInputs.js';
import APIMapping from './components/APIMapping.js';
// import axios from 'axios';
// import Select from 'react-select';
// import DiagramVariables from './components/DiagramVariables';
// import Expressionfy from './components/Expressionfy';

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

class API extends Component {
    constructor(props) {
        super(props);

        // state.variables is for variables of the diagram linked
        // props.variables is for variables of the current diagram
        this.state = {
            node: this.props.node,
            variables: [],
            dropdownOpen: false,
            type: 'headers',
            popoverOpen: false,
            mapping: []
        };

        this.toggle = this.toggle.bind(this);
        this.togglePopover = this.togglePopover.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleAddPair = this.handleAddPair.bind(this);
        this.handleRemovePair = this.handleRemovePair.bind(this);
        this.handleKVChange = this.handleKVChange.bind(this);
        this.handleAddPairMapping = this.handleAddPairMapping.bind(this);
        this.handleRemovePairMapping = this.handleRemovePairMapping.bind(this);
        this.handleKVMappingChange = this.handleKVMappingChange.bind(this);
    }

    componentWillReceiveProps(props) {
        if(props.node.id !== this.state.node.id){
            this.setState({
                node: props.node
            });
        }
    }

    handleUpdate(name, value) {
        let node = this.state.node;
        node.extras[name] = value;

        this.setState({
            node: node
        });
    }

    toggle() {
        this.setState({
          dropdownOpen: !this.state.dropdownOpen
        });
    }

    togglePopover() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    handleSelection(io, i, arg, value) {
        let node = this.state.node;

        if(node.extras[io][i][arg] !== value){
            node.extras[io][i][arg] = value;

            this.setState({
                node: node
            }, this.props.onUpdate);
        }
    }

    handleAddPair(type){
        var node = this.state.node;
        node.extras[type].push({
            key: '',
            val: ''
        });
        node.extras.inputs = node.extras[type];

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleRemovePair(type, i) {
        let node = this.state.node;

        node.extras[type].splice(i, 1);
        node.extras.inputs = node.extras[type];

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleKVChange(e, i, inputType) {
        var node = this.state.node;
        node.extras[this.state.type][i][inputType] = e.target.value;
        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleAddPairMapping(){
        var node = this.state.node;
        console.log(node.extras)
        node.extras.mapping.push({
            path: '',
            var: ''
        });
        node.extras.inputs = node.extras.mapping;

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleRemovePairMapping(i) {
        let node = this.state.node;
        console.log(i)
        console.log(node.extras.mapping)
        node.extras.mapping.splice(i, 1);
        node.extras.inputs = node.extras.mapping;
        console.log(node.extras.mapping)
        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleKVMappingChange(e, i, inputType) {
        var node = this.state.node;
        node.extras.mapping[i][inputType] = e.target.value;
        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    render() {
        let pairContent = 
            <APIInputs
                type={this.state.type}
                pairs={this.state.node.extras[this.state.type]}
                onAdd={() => this.handleAddPair(this.state.type)}
                onRemove={(e, i) => this.handleRemovePair(this.state.type, i)}
                onChange={this.handleKVChange}
            />

        return (
            <React.Fragment>
                <label>
                    METHOD
                </label>

                

                <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle caret color="link" className="link-button">
                              {this.state.node.extras.method}
                            </DropdownToggle>
                            <DropdownMenu>
                                {methods.map((method, i) => {
                                    if(method === this.state.node.extras.method){
                                        return <DropdownItem disabled>{method}</DropdownItem>
                                    }else{
                                        return <DropdownItem onClick={()=>this.handleUpdate('method', method)}>{method}</DropdownItem>
                                    }
                                })}
                            </DropdownMenu>
                        </ButtonDropdown>
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input
                        value={this.state.node.extras.url}
                        placeholder="URL Endpoint"
                        onChange={(e) => this.handleUpdate('url', e.target.value)}
                    />
                </InputGroup>
                <hr/>

                
                <Nav tabs>
                    <NavItem onClick={() => this.setState({type: 'headers'})}>
                        <NavLink href="#" active={this.state.type === 'headers'}>
                            Headers
                        </NavLink>
                    </NavItem>
                    <NavItem onClick={() => {if (this.state.node.extras.method !== 'GET') this.setState({type: 'body'})}}> 
                        <NavLink href="#" active={this.state.type === 'body'} disabled={this.state.node.extras.method === 'GET'}>Body</NavLink>
                    </NavItem>
                    <NavItem onClick={() => this.setState({type: 'params'})}> 
                        <NavLink href="#" active={this.state.type === 'params'}>Params</NavLink>
                    </NavItem>
                </Nav>

                {pairContent}
                <hr/>

                <label>Variable Mapping</label>
                <APIMapping
                    pairs={this.state.node.extras.mapping}
                    onAdd={() => this.handleAddPairMapping()}
                    onRemove={(e, i) => this.handleRemovePairMapping(i)}
                    onChange={this.handleKVMappingChange}
                />

            </React.Fragment>
        );
    }
}

export default API;
