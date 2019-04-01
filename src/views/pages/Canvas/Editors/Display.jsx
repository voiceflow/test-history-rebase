import React, { Component } from 'react';
import Select from 'react-select'
import axios from 'axios';
import { connect } from 'react-redux'
import { Button, InputGroup, Input, Modal, ModalHeader, ModalBody, InputGroupAddon } from 'reactstrap'
import {Tooltip} from 'react-tippy'
import {Link} from 'react-router-dom'

import AceEditor from 'react-ace';
import './Display.css'

import 'brace/mode/json_custom';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';

const _ = require('lodash')

export class Display extends Component {
    constructor(props) {
        super(props);

        let selected;
        if(props.node.extras.display_id){
            let find = props.displays.find(t => t.display_id === props.node.extras.display_id);
            if(find){
                selected = {
                    label: find.title,
                    value: find.display_id,
                }
            }
        }

        this.state = {
            node: props.node,
            selected: selected,
            modal: false,
            current_request: false,
            user_variables: {},
            variables: [],
            variables_error: '',
            modal_error: ''
        };

        this.onChange = this.onChange.bind(this);
        this.selectDisplay = this.selectDisplay.bind(this);
        this.onChangeEditor = this.onChangeEditor.bind(this)
        this.onChangeCommands = this.onChangeCommands.bind(this)
        this.updateOnChange = this.updateOnChange.bind(this)
        this.renderDisplayTest = this.renderDisplayTest.bind(this)
        this.testDisplay = this.testDisplay.bind(this)
        this.handleVariableChange = this.handleVariableChange.bind(this)
        this.openModal = this.openModal.bind(this)
    }

    onChange(e){
        let node = this.state.node;
        node.extras[e.target.name] = e.target.value;

        this.setState({
            node: node
        }, () => this.props.onUpdate())
    }

    onChangeEditor(value) {
        const node = this.state.node
        node.extras.datasource = value
        this.setState({
            node: node
        }, () => this.props.onUpdate())
    }

    onChangeCommands(value) {
        const node = this.state.node
        node.extras.apl_commands = value
        this.setState({
            node: node
        }, () => this.props.onUpdate())
    }

    updateOnChange() {
        const node = this.state.node
        node.extras.update_on_change = !node.extras.update_on_change
        this.setState({
            node: node
        }, () => this.props.onUpdate())    
    }

    selectDisplay(selected) {
        
        if(selected.value === this.state.node.extras.display_id) return;

        let find = this.props.displays.find(t => t.display_id === selected.value);
        let node = this.state.node;
        node.extras.display_id = find.display_id
        node.extras.datasource = find.datasource.trim() ? find.datasource : ''

        this.setState({
            selected: selected,
            node: node,
            modal_error: ''
        }, () => this.props.onUpdate())
    }

    handleVariableChange(e) {
        const user_variables = this.state.user_variables
        user_variables[e.target.name] = e.target.value
        this.setState({
            user_variables: user_variables,
            variables_error: ''
        })
    }

    testDisplay() {
        let datasource = this.state.node.extras.datasource

        for (let i = 0; i < this.state.variables.length; i++) {
            const variable = this.state.variables[i]
            const user_variable = this.state.user_variables[variable]
            if (_.isNil(user_variable) || user_variable === '') {
                this.setState({
                    variables_error: 'Variables cannot be blank!'
                })
                return
            }
        }

        if (!this.state.current_request) {
            this.setState({
                current_request: true,
                modalContent: null
            })

            Object.entries(this.state.user_variables).forEach(([old_str, new_str]) => {
                let replacement = new_str
                const re = new RegExp(`{${old_str}}`, 'g');
                datasource = datasource.replace(re, replacement)
            })

            axios.post(`/multimodal/display/render/${this.state.node.extras.display_id}`, {
              datasource: datasource
            })
            .then(res => {
                this.setState({
                    modalContent: res.data,
                    current_request: false
                })
            })
            .catch(err => {
                this.setState({
                    modalContent: err,
                    current_request: false
                })    
            })
        }
    }

    openModal() {
        const datasource = this.state.node.extras.datasource
        const variables = (datasource.match(/\{[\w\d]+\}/g) || []).map(s => s.slice(1, -1))

        if (!this.state.node.extras.display_id) {
            this.setState({
                modal_error: 'Select a display first from the drop down!'
            })
            return
        }

        this.setState({ 
            modal: true,
            modalContent: null,
            variables: variables,
            variables_error: '',
            user_variables: {}
        })
    }

    // Render entire modal
    renderDisplayTest() {
        let loading = <div className="text-center mt-3"><div className="loader text-lg"/></div>
        if (_.isNil(this.state.modalContent) && _.isEmpty(this.state.variables)) {
            this.testDisplay()
            return loading
        }

        return (
            <div>
                {
                !_.isEmpty(this.state.variables) &&
                <React.Fragment>
                    <Button color="primary" onClick={()=>this.testDisplay()} className="mt-2"><i className="fas fa-play mr-2"/> Run</Button>
                    <br />
                    <label>We've detected you are using variables in your Data Source JSON, please set variables and run</label><br/>
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
                {this.state.variables_error && <div className='error-message'>{this.state.variables_error}</div>}
                {this.state.current_request && loading}
                {this.state.modalContent && <div className="space-between flex-hard">
                    <label>
                        Display Test
                    </label>
                    <span>
                        <Tooltip
                            className="test-help"
                            title='If a black screen Appears, try double-checking your Data Source JSON and Document format. Note: This is meant to be a quick and convenient way to test your displays. We recommend using the Amazon APL Authoring Tool for double-checking how your display will look, especially on differently-sized screens.'
                            position="bottom"
                            theme="block"
                        >
                            ?
                        </Tooltip>
                    </span>
                </div>}
                
                {this.state.modalContent && <img className='test-image' alt='content' src={`data:image/png;base64,${this.state.modalContent}`} />}
            </div>
        )
    }

    render() {
        if(this.props.displays.length === 0){
            return <div>
                <span className="text-muted">You currently have no Multimodal Displays</span>
                <Link className="btn btn-clear btn-block mt-2" to={`/visuals/${this.props.skill_id}`}>Add Displays</Link> 
            </div>
        }

        return (
            <React.Fragment>
                <Modal size='lg'
                isOpen={this.state.modal}
                toggle={()=>this.setState({
                    modal: false
                })}
            >
                <ModalHeader toggle={()=>this.setState({
                    modal: false
                })}>Multimodal Display Test</ModalHeader>
                <ModalBody>
                {this.state.modal && this.renderDisplayTest()}
                </ModalBody>
            </Modal>
            <div>
                <label>Multimodal Display</label>
                <Select
                    classNamePrefix="select-box"
                    value={this.state.selected}
                    onChange={this.selectDisplay}
                    placeholder='Select Multimodal Display'
                    options={this.props.displays.map(t => {return {
                        value: t.display_id,
                        label: t.title
                    }})}
                />
                <InputGroup className="my-3">
                    <label className="input-group-text w-100 m-0 d-flex">
                        <Input addon type="checkbox" value={this.state.node.extras.update_on_change } checked={this.state.node.extras.update_on_change } onChange={this.updateOnChange}/>
                        <div className="ml-2 space-between flex-hard">
                            <span>
                                Update on Variable Changes
                            </span>
                            <span>
                                <Tooltip
                                    className="menu-tip"
                                    title='When this option is checked, the multimodal display will update whenever a change is detected in any of the variables used in the Data Source JSON'
                                    position="bottom"
                                    theme="block"
                                >
                                    ?
                                </Tooltip>
                            </span>
                        </div>
                    </label>
                </InputGroup>
                <hr/>
                <Button color="clear" onClick={this.openModal} size="sm" block><i className="fas fa-power-off mr-1"></i>Test Display</Button>
                {this.state.modal_error && <div className='error-message'>{this.state.modal_error}</div>}
                <label>Data Source JSON</label>
                <AceEditor
                    name="datasource_editor"
                    className="datasource_editor"
                    mode="json_custom"
                    theme="monokai"
                    onChange={this.onChangeEditor}
                    fontSize={14}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={this.state.node.extras.datasource}
                    editorProps={{
                        $blockScrolling: true,
                        $rules: {
                            start : [
                                {
                                    token : "highlightWords",
                                    regex : "word1|word2|word3|phrase one|phrase number two|etc"
                                }]
                        }
                    }}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                        useWorker: false
                    }}/>
                <label>APL Commands</label>
                <AceEditor
                    name="apl_commands_editor"
                    className="datasource_editor"
                    mode="json_custom"
                    theme="monokai"
                    onChange={this.onChangeCommands}
                    fontSize={14}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={this.state.node.extras.apl_commands}
                    editorProps={{
                        $blockScrolling: true,
                        $rules: {
                            start : [
                                {
                                    token : "highlightWords",
                                    regex : "word1|word2|word3|phrase one|phrase number two|etc"
                                }]
                        }
                    }}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                        useWorker: false
                    }}/>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    skill_id: state.skills.skill_id,
    displays: state.displays.displays,
})
export default connect(mapStateToProps)(Display);
