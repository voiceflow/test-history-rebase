import React, { Component } from 'react';
import { Nav, NavItem, NavLink, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import APIInputs from './components/APIInputs.js';
import APIMapping from './components/APIMapping.js';
import VariableText from './components/VariableText';
import VariableInput from './components/VariableInput';
import randomstring from 'randomstring';

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

class API extends Component {
    constructor(props) {
        super(props);

        // state.variables is for variables of the diagram linked
        // props.variables is for variables of the current diagram
        this.state = {
            node: this.props.node,
            variables: this.props.variables,
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
            index: randomstring.generate(7),
            key: '',
            val: ''
        });

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleRemovePair(type, i) {
        console.log(type);
        let node = this.state.node;
        // console.log(JSON.stringify(node.extras[type].map(e=>e.key.blocks[0].text)));
        node.extras[type].splice(i, 1);
        // console.log(JSON.stringify(node.extras[type].map(e=>e.key.blocks[0].text)));

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleKVChange(raw, i, inputType) {
        var node = this.state.node;
        node.extras[this.state.type][i][inputType] = raw;
        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleAddPairMapping(){
        var node = this.state.node;
        node.extras.mapping.push({
            path: '',
            var: ''
        });

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleRemovePairMapping(i) {
        let node = this.state.node;
        node.extras.mapping.splice(i, 1);

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleKVMappingChange(new_value, i, inputType) {
        var node = this.state.node;
        node.extras.mapping[i][inputType] = new_value;
        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    render() {
        let pairContent = 
            <APIInputs
                key={this.state.type}
                type={this.state.type}
                pairs={this.state.node.extras[this.state.type]}
                variables={this.props.variables}
                onAdd={() => this.handleAddPair(this.state.type)}
                onRemove={(e, i) => this.handleRemovePair(this.state.type, i)}
                onChange={this.handleKVChange}
            />
        let rawBodyInput = 
            <VariableText
                raw={this.state.node.extras.rawContent}
                variables={this.props.variables}
                updateRaw={(raw) => {
                    let node = this.state.node; 
                    node.extras.rawContent = raw;
                    this.setState({
                        node: node
                    })
                }}
            />
        let bodyInputNavTabs = 
            <Nav tabs>
                <NavItem onClick={() => {
                        const node = this.state.node;
                        node.extras.bodyInputType = 'keyValue';
                        this.setState({ node: node })
                        }}>
                    <NavLink href="#" active={this.state.node.extras.bodyInputType === 'keyValue'}>
                        Key Value Input
                    </NavLink>
                </NavItem>
                <NavItem onClick={() => {
                        const node = this.state.node;
                        node.extras.bodyInputType = 'rawInput';
                        this.setState({ node: node })
                        }}> 
                    <NavLink href="#" active={this.state.node.extras.bodyInputType === 'rawInput'}>
                        Raw Input
                    </NavLink>
                </NavItem>
            </Nav>

        return (
            <React.Fragment>
                <label>
                    URL Endpoint
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
                                        return <DropdownItem key={i} disabled>{method}</DropdownItem>
                                    }else{
                                        return <DropdownItem key={i} onClick={()=>this.handleUpdate('method', method)}>{method}</DropdownItem>
                                    }
                                })}
                            </DropdownMenu>
                        </ButtonDropdown>
                        </InputGroupText>
                    </InputGroupAddon>
                    <VariableInput
                        className='form-control'
                        raw={this.state.node.extras.url}
                        variables={this.props.variables}
                        updateRaw={(raw) => {
                            let node = this.state.node; 
                            node.extras.url = raw;
                            this.setState({
                                node: node
                            })
                        }}
                        placeholder="URL Endpoint"
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

                {this.state.type === 'body' ? bodyInputNavTabs : null}

                { (this.state.type === 'body' && this.state.node.extras.bodyInputType === 'rawInput') ? rawBodyInput : pairContent}
                <hr/>

                <label>VARIABLE MAPPING</label>
                <APIMapping
                    pairs={this.state.node.extras.mapping}
                    onAdd={() => this.handleAddPairMapping()}
                    onRemove={(e, i) => this.handleRemovePairMapping(i)}
                    onChange={this.handleKVMappingChange}
                    variables={this.state.variables}
                />

            </React.Fragment>
        );
    }
}

export default API;
