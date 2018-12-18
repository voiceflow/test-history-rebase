import React, { Component } from 'react';
import update from 'immutability-helper';
import * as _ from 'lodash';
import axios from 'axios';
import stringifyObject from 'stringify-object';
import isVarName from 'is-var-name';
import { Button, Modal, ModalHeader, ModalBody, Nav, NavItem, NavLink, InputGroupAddon, Input, InputGroupButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, InputGroup } from 'reactstrap';
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
            modalContent: null,
            variables: [],
            innerVariables: {},
            dropdownOpen: false,
            type: 'headers',
            popoverOpen: false
        };

        this.onChangeAce = this.onChangeAce.bind(this)
        this.getEndpoint = this.getEndpoint.bind(this);
        this.renderAPITest = this.renderAPITest.bind(this);
        this.toggle = this.toggle.bind(this);
        this.togglePopover = this.togglePopover.bind(this)
        this.handleVariableChange = this.handleVariableChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleSelection = this.handleSelection.bind(this)
        this.handleAddPair = this.handleAddPair.bind(this)
        this.handleRemovePair = this.handleRemovePair.bind(this)
        this.handleKVChange = this.handleKVChange.bind(this)
        this.handleAddPairMapping = this.handleAddPairMapping.bind(this)
        this.handleRemovePairMapping = this.handleRemovePairMapping.bind(this)
        this.handleKVMappingChange = this.handleKVMappingChange.bind(this)
    }

    componentDidMount() {
      let variable_map = {}
      this.props.variables.forEach(val =>
        variable_map[val] = ''
      );
      this.setState({innerVariables: variable_map});
    }
    onChangeAce(content){
        let node = this.state.node
        node.extras.content = content
        this.setState({
            node: node
        }, this.props.onUpdate)
    }

    getEndpoint(){
      let regex = /\{([^{}]*)\}/g;
      let variables = [];
      let url = draftToMarkdown(this.state.node.extras.url);
      let method = this.state.node.extras.method;
      const replacer = (match, inner, variables_map) => {
        if(inner in variables_map){
          return variables_map[inner];
        }else{
          return match;
        }
      }

      if (!_.isEmpty(this.state.variables)){
        url = url.replace(/\{([^{}]*)\}/g, (match, inner) => replacer(match, inner, this.state.innerVariables))
      }
      if(!_.isNull(url)){
    		let match = regex.exec(url);
    		while (match != null) {
    			if(isVarName(match[1])){
    		    	variables.push(match[1]);
    		    }
    		    match = regex.exec(url);
    		}
        if (!_.isEmpty(variables))  {
          this.setState({variables: variables})
        } else {
          axios({ method: method, url: url })
          .then(res => {
            console.log(JSON.stringify(res, null, 4))
            this.setState({
              modalContent: JSON.stringify(res, null, 4)
            })
          })
          .catch(err => {
            this.setState({
              modalContent: JSON.stringify(err, null, 4)
            })
          })
        }
    	}
      this.setState({ modal: true });
    }

    renderAPITest() {
      if (!this.state.modalContent && _.isEmpty(this.state.variables)) {
        return null;
      }
      return (
      <div className='projects-menu'>
          {
            !_.isEmpty(this.state.variables) ?
              <React.Fragment>
                <label>We've detected you are using variables, please set variables and run again</label>
                <Button color="primary" onClick={this.getEndpoint} size="sm" block><i className="fas fa-play"></i>&nbsp;&nbsp;&nbsp; Run</Button>
                <br />
              </React.Fragment> :
              null
          }
          {_.map(this.state.variables, (val, key) => (
            <React.Fragment key={key}>
              <InputGroup>
                <InputGroupAddon addonType='prepend'>{val}</InputGroupAddon>
                <Input name={val} placeholder='set variable' onChange={this.handleVariableChange} />
              </InputGroup>
            </React.Fragment>
          ))}
        <div>
          <pre>{this.state.modalContent}</pre>
        </div>
      </div>);
    }

    handleVariableChange = event => {
      this.setState({
        innerVariables: update(this.state.innerVariables, {[event.target.name]: {$set:event.target.value}})
      })
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
              <Modal
                isOpen={this.state.modal}
                toggle={()=>this.setState({modalContent: null, modal: false, variables: []})}
              >
                <ModalHeader toggle={()=>this.setState({modalContent:null, modal: false, variables: []})}>API Test</ModalHeader>
                <ModalBody>
                  {this.renderAPITest()}
                </ModalBody>
              </Modal>
                <label>
                    URL Endpoint
                </label>
                <Button color="primary" onClick={this.getEndpoint} size="sm" block><i className="fas fa-play"></i>&nbsp;&nbsp;&nbsp; Test Endpoint</Button>
                <br />
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
                        className='form-control-border top-left form-control right'
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
                    <NavItem className="mr-2" onClick={() => this.setState({type: 'headers'})}>
                        <NavLink href="#" active={this.state.type === 'headers'}>
                            Headers
                        </NavLink>
                    </NavItem>
                    <NavItem className="mr-2" onClick={() => {if (this.state.node.extras.method !== 'GET') this.setState({type: 'body'})}}>
                        <NavLink href="#" active={this.state.type === 'body'} disabled={this.state.node.extras.method === 'GET'}>Body</NavLink>
                    </NavItem>
                    <NavItem className="mr-2" onClick={() => this.setState({type: 'params'})}>
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
