import React, { Component } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input } from 'reactstrap';
import axios from 'axios';
import Select from 'react-select';
import DiagramVariables from './components/DiagramVariables';
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
            dropdownOpen: false
        };

        this.toggle = this.toggle.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleAddMap = this.handleAddMap.bind(this);
        this.handleRemoveMap = this.handleRemoveMap.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
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

                //     <label>Inputs</label>
                // <label>Outputs</label>

    render() {
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
                <hr/>

            </React.Fragment>
        );
    }
}

export default API;
