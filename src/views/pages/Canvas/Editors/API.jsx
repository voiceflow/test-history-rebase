import React, { Component } from 'react';
import update from 'immutability-helper';
import serializeError from 'serialize-error';
import pretty from 'prettysize';
import * as _ from 'lodash';
import axios from 'axios';
import isVarName from 'is-var-name';
import ReactJson from 'react-json-view';
import { Button, ButtonGroup, Modal, ModalBody, Nav, NavItem, NavLink, InputGroupAddon, Input, InputGroupButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, InputGroup } from 'reactstrap';
import { ModalHeader } from 'components/Modals/ModalHeader'
import APIInputs from './components/APIInputs';
import APIMapping from './components/APIMapping';
import VariableInput from './components/VariableInput';
import randomstring from 'randomstring';
import { ContentState, convertToRaw } from 'draft-js';
import AceEditor from 'react-ace'
import draftToMarkdown from '../../../../services/draftConvert'

import 'brace/mode/javascript'
import 'brace/theme/chrome'

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const TABS = ['raw', 'formatted', 'results'];

class API extends Component {
    constructor(props) {
        super(props);

        let node = props.node;
        let tab = localStorage.getItem('api_test_tab')
        if(!tab) tab = TABS[1]

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
            popoverOpen: false,
            loading: false
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
        this.copyJSONPath = this.copyJSONPath.bind(this)
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

    copyJSONPath(copy_event){
        let total_path = copy_event.namespace.slice()

        if(copy_event.name !== ''){
            total_path.push(copy_event.name)
        }

        // Copy to clipboard
        const el = document.createElement('textarea');
        el.value = total_path.join('.');
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    getEndpoint(firstClick=true){
        let regex = /\{([A-Za-z0-9_]*)\}/g;
        let variables = []
        let userHeader = {}
        let userBody = {}
        let url = draftToMarkdown(this.state.node.extras.url);
        let method = this.state.node.extras.method;
        const { body, headers, params, bodyInputType, content, mapping } = this.props.node.extras
        const replacer = (match, inner, variables_map, url=false) => {
            if(inner in variables_map){
                return url ?  encodeURI(variables_map[inner]) : variables_map[inner];
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

        if(!_.isNull(url)){
    		    finder(url);
            // Distinguish between body rawInput and pairs
            if (bodyInputType === 'rawInput') {
            finder(content);
            } else {
              _.forEach(_.concat(body), nodeValue => {
                _.forEach(_.concat(nodeValue['key'], nodeValue['val']), value => {
                finder(draftToMarkdown(value))
                })
              })
            }
            // Find variables inside of Headers, Body, and Params
            _.forEach(_.concat(headers, params), nodeValue => {
              _.forEach(_.concat(nodeValue['key'], nodeValue['val']), value => {
                finder(draftToMarkdown(value))
              })
            });
            // Find variables inside of result variable mappings
            _.forEach(mapping, map => {
              finder(draftToMarkdown(map.path))
            });

            // Check if user requires variables to be filled
            if ( !_.isEmpty(variables) && firstClick)  {
                this.setState({variables: variables})
            } else {
                // Set time before response
                this.setState({loading: true})
                let time = Date.now()
                const markdownToObject = (nodes) => {
                    let object = {}
                    _.forEach(nodes, node => {
                        let value = draftToMarkdown(node.key).replace(/\{([A-Za-z0-9_]*)\}/g, (match, inner) => replacer(match, inner, this.state.innerVariables))
                        if(value){
                            object[value] = draftToMarkdown(node.val).replace(/\{([A-Za-z0-9_]*)\}/g, (match, inner) => replacer(match, inner, this.state.innerVariables))
                        }
                    })
                    return object
                }

                // Replace url with user set variables
                let new_url
                new_url = url.replace(/\{([A-Za-z0-9_]*)\}/g, (match, inner) => replacer(match, inner, this.state.innerVariables, true)).trim()

                // Check that variables are set before pushing in
                let request_obj = {
                    method: method ? method : 'GET',
                    url: new_url,
                    params: markdownToObject(params)
                }
                userHeader = markdownToObject(headers)
                if(!_.isEmpty(userHeader)){
                    request_obj.headers = userHeader
                }
                if (bodyInputType === 'rawInput') {
                    request_obj.body = content.replace(/\{([A-Za-z0-9_]*)\}/g, (match, inner) => replacer(match, inner, this.state.innerVariables))
                } else {
                    userBody = markdownToObject(body)
                    if(!_.isEmpty(userBody)){
                        request_obj.body = userBody
                    }
                }

                let varMap = {}

                axios.post('/test/api', {api: request_obj})
                .then(res => {
                    // Map all paths user requires to varMap
                    _.forEach(mapping, map => {
                        if(map.var){
                            try {
                                varMap[map.var] = JSON.stringify(this.findPath(draftToMarkdown(map.path).replace(/\{([A-Za-z0-9_]*)\}/g, (match, inner) => replacer(match, inner, this.state.innerVariables)), res.data), null, 4)
                            } catch(error) {
                                varMap[map.var] = 'undefined'
                            }
                        }
                    })
                    this.setState({
                        testHeader: update(this.state.testHeader, {
                            'status': {$set: res.status},
                            'time': {$set: Date.now()-time},
                            'size': {$set: pretty(JSON.stringify(res).length * 7)},
                        }),
                        loading: false,
                        testVariablesMapping: varMap,
                        modalContent: res.data
                    })
                })
                .catch(err => {
                    console.log(err)
                    let status = (err.response) ? err.response.status : err.status
                    let error = err && err.response && err.response.data
                    this.setState({
                        testHeader: update(this.state.testHeader, {
                            'status': {$set: status},
                            'time': {$set: Date.now()-time},
                            'size': {$set: pretty(JSON.stringify(err).length * 7)},
                        }),
                        loading: false,
                        testVariablesMapping: varMap,
                        modalContent: serializeError(error)
                    })
                })
            }
    	}
        this.setState({ modal: true });
    }

    // Render entire modal
    renderAPITest() {
        let loading = <div className="text-center mt-3"><div className="loader text-lg"/></div>
      if ((_.isNull(this.state.modalContent) && _.isEmpty(this.state.variables))) {
        return loading
      }

      return (
      <div className='projects-menu'>
          {
            !_.isEmpty(this.state.variables) &&
              <React.Fragment>
                <Button color="primary" onClick={()=>this.getEndpoint(false)} className="mt-2"><i className="fas fa-play mr-2"/> Run</Button>
                <br />
                <label>We've detected you are using variables in your API call, please set variables and run</label><br/>
                {_.map(this.state.variables, (val, key) => (
                    <React.Fragment key={key}>
                    <InputGroup className="mb-2">
                        <InputGroupAddon addonType='prepend'>{val}</InputGroupAddon>
                        <Input className='form-control form-control-border right' name={val} placeholder='set variable' onChange={this.handleVariableChange} />
                    </InputGroup>
                    </React.Fragment>
                ))}
              </React.Fragment>
          }
        {!_.isNull(this.state.modalContent) ?
            <div className={"status " + ((this.state.testHeader.status && this.state.testHeader.status < 300) ? 'success' : 'fail')}>
            <div className="my-3">
                <div className="last-save">Status: {this.state.testHeader.status ? <span>{this.state.testHeader.status}</span> : null}</div>
                <div className="last-save">Time: {this.state.testHeader.time ?  this.state.testHeader.time + 'ms': null}</div>
                <div className="last-save">Size: {this.state.testHeader.size ? this.state.testHeader.size : null}</div>
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
            {this.state.activeTab === TABS[0] &&
                <div className="response-box">
                    <pre className="mb-0 p-1">{typeof this.state.modalContent === 'string' ? this.state.modalContent : JSON.stringify(this.state.modalContent, null, 2)}</pre>
                </div>
            }
            {this.state.activeTab === TABS[1] &&
                <div className="response-box">
                    <ReactJson src={this.state.modalContent} displayDataTypes={false} name='response' enableClipboard={this.copyJSONPath}/>
                </div>
            }
            {this.state.activeTab === TABS[2] &&
                <div className="mt-3">
                    {_.map(this.state.testVariablesMapping, (val, key) => {
                        let path = _.find(this.props.node.extras.mapping, {'var': key}).path;
                        return <pre id="api-results" key={key}>{draftToMarkdown(path) + ': ' + val + ' => {' + key + '}'}</pre>
                    })}
                </div>
            }
          </div> : (this.state.loading ? loading : null )
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
        this.props.clearRedo();
        this.props.updateEvents(_.cloneDeep(node).extras);

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
        this.props.clearRedo()
        this.props.updateEvents(_.cloneDeep(node).extras);

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
        this.props.clearRedo()
        this.props.updateEvents(_.cloneDeep(node).extras);

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
        this.props.clearRedo()
        this.props.updateEvents(_.cloneDeep(node).extras);

        node.extras.mapping.splice(i, 1);

        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleKVMappingChange(new_value, i, inputType) {
        var node = this.state.node;
        this.props.clearRedo()
        this.props.updateEvents(_.cloneDeep(node).extras);
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
              <Modal size='lg'
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
                })} header='API Test' />
                <ModalBody>
                  {this.renderAPITest()}
                </ModalBody>
              </Modal>
                <label>
                    URL Endpoint
                </label>
                <br />
                <InputGroup>
                    <InputGroupButtonDropdown addonType="prepend" className="mb-3 pt-1 pb-1" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
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
                        className='form-control-border top-left form-control right mb-3'
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
                <Button className="btn-lg btn-block" color="clear" onClick={this.getEndpoint} block><i className="fas fa-power-off mr-2"></i>Test Endpoint</Button>
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
                                node.extras.bodyInputType = 'formData';
                                this.setState({ node: node })
                                }}>
                            <NavLink href="#" active={this.state.node.extras.bodyInputType === 'formData'}>
                                Form Data
                            </NavLink>
                        </NavItem>
                        <NavItem onClick={() => {
                                const node = this.state.node;
                                node.extras.bodyInputType = 'urlEncoded';
                                this.setState({ node: node })
                                }}>
                            <NavLink href="#" active={this.state.node.extras.bodyInputType === 'urlEncoded'}>
                                Form Url-Encoded
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
    }
}

export default API;
