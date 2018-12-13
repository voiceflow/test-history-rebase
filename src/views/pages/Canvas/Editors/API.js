import React, { Component } from 'react';
import { Nav, NavItem, NavLink, InputGroupButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, InputGroup } from 'reactstrap';
import APIInputs from './components/APIInputs.js';
import APIMapping from './components/APIMapping.js';
import VariableInput from './components/VariableInput';
import randomstring from 'randomstring';
import { ContentState, convertToRaw } from 'draft-js';
import AceEditor from 'react-ace'
import draftToMarkdown from './../../../../services/draftConvert'

import 'brace/mode/javascript'
import 'brace/theme/chrome'

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

class API extends Component {
    constructor(props) {
        super(props);

        let node = props.node;
        
        // DEPRECATE turning from string to draftjs for SUPER old api blocks
        if(node.extras.mapping){
            node.extras.mapping = node.extras.mapping.map((choice) => {
                if(typeof choice.path === 'string'){
                    return {
                        path: convertToRaw(ContentState.createFromText(choice.path)),
                        var: choice.var,
                        index: randomstring.generate(10)
                    }
                }else if(!choice.index){
                    return {
                        index: randomstring.generate(10),
                        ...choice
                    };
                }else{
                    return choice;
                }
            })
        }

        // DEPRECATE OLD API BLOCK
        if(node.extras.rawContent){
            node.extras.content = draftToMarkdown(node.extras.rawContent, {newline: true})
            node.extras.rawContent = null
            delete node.extras.rawContent
        }else if(!node.extras.content){
            node.extras.content = ""
        }

        // state.variables is for variables of the diagram linked
        // props.variables is for variables of the current diagram
        this.state = {
            node: node,
            modal: false,
            body_state: true,
            dropdownOpen: false,
            type: 'headers',
            popoverOpen: false
        };

        this.onChangeAce = this.onChangeAce.bind(this)
        this.toggle = this.toggle.bind(this);
        this.togglePopover = this.togglePopover.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleSelection = this.handleSelection.bind(this)
        this.handleAddPair = this.handleAddPair.bind(this)
        this.handleRemovePair = this.handleRemovePair.bind(this)
        this.handleKVChange = this.handleKVChange.bind(this)
        this.handleAddPairMapping = this.handleAddPairMapping.bind(this)
        this.handleRemovePairMapping = this.handleRemovePairMapping.bind(this)
        this.handleKVMappingChange = this.handleKVMappingChange.bind(this)
    }

    onChangeAce(content){
        let node = this.state.node
        node.extras.content = content
        this.setState({
            node: node
        }, this.props.onUpdate)
    }

    handleUpdate(name, value) {
        let node = this.state.node;
        node.extras[name] = value;

        this.setState({
            node: node
        }, this.props.onUpdate);
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
            index: randomstring.generate(10),
            key: '',
            val: ''
        });

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleRemovePair(type, i) {
        let node = this.state.node;
        node.extras[type].splice(i, 1);
        
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
            index: randomstring.generate(10),
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

        let pairContent = <APIInputs
            key={this.state.type}
            type={this.state.type}
            pairs={this.state.node.extras[this.state.type]}
            variables={this.props.variables}
            onAdd={() => this.handleAddPair(this.state.type)}
            onRemove={(e, i) => this.handleRemovePair(this.state.type, i)}
            onChange={this.handleKVChange}
        />

        return (
            <React.Fragment>
                <label>
                    URL Endpoint
                </label>
                <InputGroup>
                    <InputGroupButtonDropdown addonType="prepend" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle caret>
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
                    </InputGroupButtonDropdown>
                    <VariableInput
                        className='form-control'
                        raw={this.state.node.extras.url}
                        variables={this.props.variables}
                        updateRaw={(raw) => {
                            let node = this.state.node; 
                            node.extras.url = raw
                            this.setState({
                                node: node
                            })
                        }}
                        placeholder="URL Endpoint"
                    />
                </InputGroup>
                <hr/>
                <Nav tabs className="mb-3">
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

                {this.state.type === 'body' ? <React.Fragment>
                    <Nav tabs className="mb-3">
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
                    { (this.state.node.extras.bodyInputType === 'rawInput') ? 
                    <AceEditor
                        height='300px'
                        width='100%'
                        className="editor"
                        mode="javascript"
                        theme="chrome"
                        onChange={this.onChangeAce}
                        fontSize={14}
                        showPrintMargin={true}
                        showGutter={false}
                        highlightActiveLine={true}
                        value={this.state.node.extras.content}
                        editorProps={{$blockScrolling: true}}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: false,
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 2
                    }}/> : pairContent}
                </React.Fragment> : pairContent}

                <hr/>

                <label>Result Variable Mapping</label>
                <APIMapping
                    pairs={this.state.node.extras.mapping}
                    onAdd={() => this.handleAddPairMapping()}
                    onRemove={(e, i) => this.handleRemovePairMapping(i)}
                    onChange={this.handleKVMappingChange}
                    variables={this.props.variables}
                />

            </React.Fragment>
        )

        // return <React.Fragment>
        //     {this.state.body_state ? 
        //         <React.Fragment>
        //             <Button color='clear' block onClick={
        //                 ()=>this.setState({
        //                     body_state: false,
        //                     modal: true
        //                 })
        //             }><i className="far fa-expand-arrows-alt"/> Expand</Button>
        //             {content}
        //         </React.Fragment>
        //         : 
        //         <React.Fragment>
        //             <Button color='clear' block disabled>{ this.state.modal ?
        //                 <React.Fragment>
        //                     <i className="far fa-expand-arrows-alt"/> Expanded
        //                 </React.Fragment> :
        //                 <span className="loader"/>
        //             }</Button>

        //             <Modal 
        //                 isOpen={this.state.modal} 
        //                 toggle={()=>this.setState({modal: false})}
        //                 onClosed={()=>this.setState({body_state: true})}
        //                 size="lg"
        //             >
        //                 <ModalHeader toggle={()=>this.setState({modal: false})}>{this.state.node.name} Settings</ModalHeader>
        //                 <ModalBody className="pb-5">
        //                     {content}
        //                 </ModalBody>
        //             </Modal>
        //         </React.Fragment>
        //     }
        // </React.Fragment>
    }
}

export default API;
