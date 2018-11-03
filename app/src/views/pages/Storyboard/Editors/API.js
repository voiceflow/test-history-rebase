import React, { Component } from 'react';
import { Nav, NavItem, NavLink, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input } from 'reactstrap';
import APIInputs from './components/APIInputs.js';
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
            type: 'headers'
        };

        this.toggle = this.toggle.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleAddMap = this.handleAddMap.bind(this);
        this.handleRemoveMap = this.handleRemoveMap.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleAddPair = this.handleAddPair.bind(this);
        this.handleRemovePair = this.handleRemovePair.bind(this);
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

    handleAddMap(io) {
        var node = this.state.node;
        node.extras[io].push({
            arg1: null,
            arg2: null
        });

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleRemoveMap(io, i) {
        let node = this.state.node;

        node.extras[io].splice(i, 1);

        this.setState({
            node: node
        }, this.props.onUpdate);
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
        console.log(node.extras)
        node.extras[type].push({
            key: '',
            val: ''
        });
        node.extras.inputs.push('');


        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleRemovePair(type, key) {
        let node = this.state.node;

        delete node.extras[type][key];

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    // <label>Inputs</label>
    // <label>Outputs</label>

    render() {
        let content;
        if (this.state.type === 'headers') {
            content =
                <div>
                    Pipsum bipsum
                </div>
        }else if (this.state.type === 'body'){
            content = 
                <div>
                    Lickem dicksum
                </div>
        }else if (this.state.type === 'params'){
            content =
                <div>
                    WEoe
                </div>
        }

        let pairContent = 
            <APIInputs
                type={this.state.type}
                pairs={this.state.node.extras[this.state.type]}
                onAdd={() => this.handleAddPair(this.state.type)}
                onRemove={(i) => this.handleRemovePair(this.state.type, i)}
            />

        return (
            <React.Fragment>
                <label>METHOD</label>
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
                <Input 
                    value={this.state.node.extras.url}
                    placeholder="URL Endpoint"
                    onChange={(e) => this.handleUpdate('url', e.target.value)}
                />
                <br/>
                
                <Nav tabs>
                    <NavItem onClick={() => this.setState({type: 'headers'})}>
                        <NavLink href="#" active={this.state.type === 'headers'}>Headers</NavLink>
                    </NavItem>
                    <NavItem onClick={() => {if (this.state.node.extras.method !== 'GET') this.setState({type: 'body'})}}> 
                        <NavLink href="#" active={this.state.type === 'body'} disabled={this.state.node.extras.method === 'GET'}>Body</NavLink>
                    </NavItem>
                    <NavItem onClick={() => this.setState({type: 'params'})}> 
                        <NavLink href="#" active={this.state.type === 'params'}>Params</NavLink>
                    </NavItem>

                </Nav>
                
                {content}
                {pairContent}

            </React.Fragment>
        );
    }
}

export default API;
