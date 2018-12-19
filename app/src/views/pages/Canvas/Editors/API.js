import React, { Component } from 'react';
import update from 'immutability-helper';
import pretty from 'prettysize';
import * as _ from 'lodash';
import axios from 'axios';
import stringifyObject from 'stringify-object';
import isVarName from 'is-var-name';
import { Button, ButtonGroup, Modal, ModalHeader, ModalBody, Nav, NavItem, NavLink, InputGroupAddon, Input, InputGroupButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, InputGroup } from 'reactstrap';
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
const TABS = ['raw', 'results'];

class API extends Component {
    constructor(props) {
        super(props);

        let node = props.node;
        let tab = localStorage.getItem('api_test_tab')
        if(!tab) tab = TABS[0]

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
            activeTab: tab,
            body_state: true,
            modalContent: null,
            variables: [],
            innerVariables: {},
            testVariablesMapping: {},
            dropdownOpen: false,
            type: 'headers',
            testHeader: {'status': null, 'time': null, 'size': null},
            popoverOpen: false
        };

        this.onChangeAce = this.onChangeAce.bind(this)
        this.getEndpoint = this.getEndpoint.bind(this);
        this.renderAPITest = this.renderAPITest.bind(this);
        this.findPath = this.findPath.bind(this);
        this.switchTab = this.switchTab.bind(this);
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

    findPath(path, data){
      const props = path.split('.')
      let cur_data = { response: data }
      props.forEach( prop => {
          const props_and_inds = prop.split('[');
          props_and_inds.forEach( prop_or_ind => {
              if (prop_or_ind.indexOf(']') >= 0) {
                  const index_str = prop_or_ind.slice(0, -1);
                  let index;
                  if (index_str.toLowerCase() === '{random}') {
                      index = Math.floor(Math.random() * cur_data.length)
                  } else {
                      index = parseInt(index_str)
                  }
                  cur_data = cur_data[index]
              } else {
                  cur_data = cur_data[prop_or_ind]
              }
          })
      })

      return cur_data
    }

    getEndpoint(firstClick=true){
      let regex = /\{([^{}]*)\}/g;
      let variables = [];
      let userHeader = {};
      let userBody = {};
      let userParam = {};
      let url = draftToMarkdown(this.state.node.extras.url);
      let method = this.state.node.extras.method;
      const { body, headers, params, bodyInputType, content, mapping } = this.props.node.extras;
      const replacer = (match, inner, variables_map) => {
        if(inner in variables_map){
          return variables_map[inner];
        }else{
          return match;
        }
      }

      // Utility function to find all variables
      const finder = url => {
        let match = regex.exec(url);
    		while (match != null) {
    			if(isVarName(match[1]) && !_.includes(variables, match[1])){
    		    	variables.push(match[1]);
    		    }
    		    match = regex.exec(url);
    		}
      }

      // Replace url with user set variables
      let new_url
      new_url = url.replace(/\{([^{}]*)\}/g, (match, inner) => replacer(match, inner, this.state.innerVariables))
      if(!_.isNull(url)){
    		finder(url);
        // Distinguish between body rawInput and pairs
        if (bodyInputType === 'rawInput') {
          finder(content);
        } else {
          _.forEach(_.concat(body), nodeValue => {
            _.forEach(_.concat(nodeValue['key'], nodeValue['val']), value => {
              finder(draftToMarkdown(value));
            })
          })
        }
        // Find variables inside of Headers, Body, and Params
        _.forEach(_.concat(headers, params), nodeValue => {
          _.forEach(_.concat(nodeValue['key'], nodeValue['val']), value => {
            finder(draftToMarkdown(value));
          })
        });
        // Find variables inside of result variable mappings
        _.forEach(mapping, map => {
          finder(draftToMarkdown(map.path));
        });

        // Check if user requires variables to be filled
        if ( !_.isEmpty(variables) && firstClick)  {
          this.setState({variables: variables})
        } else {
          // Set time before response
          let time = Date.now();
          const markdownToObject = nodes => {
            let object = {};
            _.forEach(nodes, node => {
              object[draftToMarkdown(
                node.key
              ).replace(/\{([^{}]*)\}/g, (match, inner) => replacer(match, inner, this.state.innerVariables))]=draftToMarkdown(
                node.val
              ).replace(/\{([^{}]*)\}/g, (match, inner) => replacer(match, inner, this.state.innerVariables))
            })
            return object;
          }
          userHeader = markdownToObject(headers);
          if (bodyInputType === 'rawInput') {
            userBody = content.replace(/\{([^{}]*)\}/g, (match, inner) => replacer(match, inner, this.state.innerVariables));
          } else {
            userBody = markdownToObject(body);
          }
          userParam = markdownToObject(params);

          let varMap = {};
          axios({ method: method, url: new_url, headers: userHeader, body: userBody, params: userParam })
          .then(res => {
            // Map all paths user requires to varMap
            _.forEach(mapping, map => {
              try {
                varMap[map.var] = JSON.stringify(this.findPath(draftToMarkdown(map.path).replace(/\{([^{}]*)\}/g, (match, inner) => replacer(match, inner, this.state.innerVariables)), res.data), null, 4)
              } catch(error) {
                varMap[map.var] = null;
              }
            })
            this.setState({
              testHeader: update(this.state.testHeader, {
                'status': {$set: res.status},
                'time': {$set: Date.now()-time},
                'size': {$set: pretty(JSON.stringify(res).length * 7)},
              }),
              testVariablesMapping: varMap,
              modalContent: JSON.stringify(res.data, null, 4)
            })
          })
          .catch(err => {
            // Map all paths user requires to varMap
            _.forEach(mapping, map => {
              try {
                varMap[map.var] = JSON.stringify(this.findPath(draftToMarkdown(map.path).replace(/\{([^{}]*)\}/g, (match, inner) => replacer(match, inner, this.state.innerVariables)), err), null, 4)
              } catch(error) {
                varMap[map.var] = null;
              }
            })
            this.setState({
              testHeader: update(this.state.testHeader, {
                'status': {$set: err.status},
                'time': {$set: Date.now()-time},
                'size': {$set: pretty(JSON.stringify(err).length * 7)},
              }),
              testVariablesMapping: varMap,
              modalContent: JSON.stringify(err, null, 4)
            })
          })
        }
    	}
      this.setState({ modal: true });
    }

    renderAPITest() {
      if (_.isNull(this.state.modalContent) && _.isEmpty(this.state.variables)) {
        return null;
      }
      let borderStyle = {borderColor: 'red'};
      if (this.state.testHeader.status) {
        borderStyle = {borderColor: 'green'}
      }
      return (
      <div className='projects-menu'>
          {
            !_.isEmpty(this.state.variables) ?
              <React.Fragment>
                <label>We've detected you are using variables, please set variables and run again</label>
                <Button color="primary" onClick={()=>this.getEndpoint(false)} size="sm" block><i className="fas fa-play"></i>&nbsp;&nbsp;&nbsp; Run</Button>
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
        {!_.isNull(this.state.modalContent) ?
          <div>
            <div className="property">
              <div>
                <div className="last-save">{this.state.testHeader.status ? 'Status: ' + this.state.testHeader.status : null}</div>
                <div className="last-save">{this.state.testHeader.time ? 'Time: ' + this.state.testHeader.time + 'ms': null}</div>
                <div className="last-save">{this.state.testHeader.size ? 'Size: ' + this.state.testHeader.size : null}</div>
              </div>
            </div>
            <ButtonGroup className="toggle-group mb-2">
              {_.map(TABS, tab => (
                <Button
                  key={tab}
                  onClick={() => this.switchTab(tab)}
                  outline={this.state.activeTab !== tab}
                  disabled={this.state.activeTab === tab}
                >
                  {tab}
                </Button>
              ))}
            </ButtonGroup>
            {this.state.activeTab === TABS[0] ?
              <div style={borderStyle} className="response-box">
                <pre>{this.state.modalContent}</pre>
              </div> :
              _.map(this.state.testVariablesMapping, (val, key) => {
                let path = _.find(this.props.node.extras.mapping, {'var': key}).path;
                return <pre key={key}>{draftToMarkdown(path) + ' = ' + key + ' => ' + val}</pre>
              })
            }
          </div> : null
        }
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

    switchTab(tab) {
      if(tab !== this.state.activetTab){
        this.setState({
          activeTab: tab
        }, ()=>localStorage.setItem('api_test_tab', tab))
      }
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
                toggle={()=>this.setState({
                  modalContent: null, modal: false,
                  variables: [],
                  testHeader: {'status': null, 'time': null, 'size': null}
                })}
              >
                <ModalHeader toggle={()=>this.setState({
                  modalContent: null,
                  modal: false,
                  variables: [],
                  testHeader: {'status': null, 'time': null, 'size': null}
                })}>API Test</ModalHeader>
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
