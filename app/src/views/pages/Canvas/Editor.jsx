import _ from 'lodash';
import React, { Component } from 'react';
import Line from './Editors/Line';
import Choice from './Editors/Choice';
import Intent from './Editors/Intent'
import Interaction from './Editors/Interaction';
import Story from './Editors/Story';
import Random from './Editors/Random';
import Variable from './Editors/Variable';
import SetBlock from './Editors/Set';
import IfBlock from './Editors/If';
import OldIfBlock from './Editors/OldIf';
import Speak from './Editors/Speak';
import OldSpeak from './Editors/OldSpeak';
import Card from './Editors/Card';
import Capture from './Editors/Capture';
import OldCommand from './Editors/OldCommand';
import Command from './Editors/Command';
import Diagram from './Editors/Diagram';
import API from './Editors/API';
import Payment from './Editors/Payment';
import CancelPayment from './Editors/CancelPayment';
import Module from './Editors/Module';
import Mail from './Editors/Mail';
import Display from './Editors/Display'
import Stream from './Editors/Stream';
import Permissions from './Editors/Permissions';
import Onboarding from './Onboarding'
import Reminder from './Editors/Reminder'
import Code from './Editors/Code'
import PermissionCard from './Editors/PermissionCard'
import {getBlocks} from './Blocks'
import Prompt from 'views/components/Uploads/Prompt'

import {
    Alert,
    Modal, ModalBody, ModalHeader,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

import { SLOT_TYPES_MAP, BUILT_IN_INTENTS, SLOT_TYPES_UNIVERSAL } from './Constants'

const BUILT_INS = BUILT_IN_INTENTS.map( intent => {
    return {
        built_in: true,
        name: intent.name,
        key: intent.name,
        inputs: [{
            text: '',
            slots: intent.slots
        }]
    }
})

class Editor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            node: this.props.node,
            templates: [],
            displays: [],
            account_linking: {},
            modal: false,
            expanded: false,
            error: null,
            confirm: null
        }

        this.eventHandler = this.eventHandler.bind(this)
        this.getSlotTypes = this.getSlotTypes.bind(this)
        this.BlockViewer = this.BlockViewer.bind(this)
        this.renderTitle = this.renderTitle.bind(this)
        this.toggleReprompt = this.toggleReprompt.bind(this)
        this.EditorRender = this.EditorRender.bind(this)
    }
    static getDerivedStateFromProps(props){
        return {
            node: props.node
        }
    }

    handleChange(e, key = undefined) {
        var node = this.state.node
        var name = e.target.getAttribute('name')
        var value = e.target.value
        node[name] = value
        if (node.parentCombine){
            _.find(node.parentCombine.combines, n => n.id === node.id).name=value;

        }
        this.setState({
            node: node
        }, () => {
            this.props.onUpdate();
            if(name === 'name'){
                this.props.repaint();
            }
        });
    }

    getSlotTypes(locales) {
        let SLOT_TYPES = []
        _.map(locales, locale => {
            SLOT_TYPES.push(SLOT_TYPES_MAP[locale])
        })
        SLOT_TYPES.push(SLOT_TYPES_UNIVERSAL)
        SLOT_TYPES = _.uniq(_.flatten(SLOT_TYPES))
        if (SLOT_TYPES.length > 0) {
            SLOT_TYPES = SLOT_TYPES.slice(0, 1).concat(SLOT_TYPES.slice(1).sort())
        }
        return SLOT_TYPES
    }

    BlockViewer(variables) {
        switch(this.state.node.extras.type) {
            case 'story':
                return <Story/>;
            case 'choice':
            case 'choicenew':
                return <Choice
                        node={this.state.node}
                        onUpdate={this.props.onUpdate}
                        diagramEngine={this.props.diagramEngine}
                        repaint={this.props.repaint}
                        live_mode={this.props.live_mode}
                    />
            case 'intent':
                return <Intent
                        node={this.state.node}
                        onUpdate={this.props.onUpdate}
                        intents={this.props.intents}
                        slots={this.props.slots}
                        diagramEngine={this.props.diagramEngine}
                        variables={variables}
                        slot_types={this.getSlotTypes(this.props.locales)}
                        built_ins={BUILT_INS}
                        onError={this.props.onError}
                        onConfirm={this.props.onConfirm}
                        skill={this.props.skill}
                        history={this.props.history}
                        diagrams={this.props.diagrams}
                        diagram_id={this.props.diagram_id}
                        setCanFulfill={this.props.setCanFulfill}
                        diagram_level_intents={this.props.diagram_level_intents}
                        live_mode={this.props.live_mode}
                    />
            case 'command':
                // DEPRECATE OLD COMMAND BLOCKS
                if(typeof this.state.node.extras.commands === 'string'){
                    return <OldCommand node={this.state.node} onUpdate={this.props.onUpdate}/>
                }else{
                    return <Command
                        node={this.state.node}
                        onUpdate={this.props.onUpdate}
                        intents={this.props.intents}
                        slots={this.props.slots}
                        variables={variables}
                        slot_types={this.getSlotTypes(this.props.locales)}
                        built_ins={BUILT_INS}
                        onError={this.props.onError}
                        repaint={this.props.repaint}
                        createDiagram={this.props.createDiagram}
                        current={this.props.diagram_id}
                        diagrams={this.props.diagrams}
                        enterFlow={this.props.enterFlow}
                        onConfirm={this.props.onConfirm}
                        live_mode={this.props.live_mode}
                    />
                }
            case 'interaction':
                return <Interaction
                    node={this.state.node}
                    onUpdate={this.props.onUpdate}
                    repaint={this.props.repaint}
                    intents={this.props.intents}
                    slots={this.props.slots}
                    onSlot={this.props.onSlot}
                    onIntent={this.props.onIntent}
                    diagramEngine={this.props.diagramEngine}
                    variables={variables}
                    slot_types={this.getSlotTypes(this.props.locales)}
                    built_ins={BUILT_INS}
                    onError={this.props.onError}
                    onConfirm={this.props.onConfirm}
                    live_mode={this.props.live_mode}
                    />
            case 'combine':
            case 'line':
            case 'audio':
            case 'multiline':
                // DEPRECATE OLD LINE BLOCKS
                if(this.state.node.extras.type !== 'combine'){
                    let node = this.state.node
                    node.extras.type = 'combine'
                    this.setState({node: node})
                }
                return <Line node={this.state.node} onUpdate={this.props.onUpdate}/>
            case 'set':
                return <SetBlock node={this.state.node} variables={variables} onUpdate={this.props.onUpdate}/>
            case 'variable':
                return <Variable node={this.state.node} variables={variables} onUpdate={this.props.onUpdate}/>
            case 'if':
                // DEPRECATE OLD IF BLOCK
                if(this.state.node.extras.expressions){
                    return <IfBlock node={this.state.node} diagramEngine={this.props.diagramEngine} variables={variables} onUpdate={this.props.onUpdate} repaint={this.props.repaint}/>
                }else{
                    return <OldIfBlock node={this.state.node} variables={variables} onUpdate={this.props.onUpdate} repaint={this.props.repaint}/>
                }
            case 'random':
                return <Random node={this.state.node} diagramEngine={this.props.diagramEngine} onUpdate={this.props.onUpdate} repaint={this.props.repaint}/>
            case 'speak':
                // DEPRECATE OLD SPEAK BLOCKS
                if(this.state.node.extras.raw !== undefined){
                    return <OldSpeak node={this.state.node} onUpdate={this.props.onUpdate} variables={variables}/>
                } else {
                    return <Speak node={this.state.node} onUpdate={this.props.onUpdate} variables={variables}/>
                }
            case 'card':
                return <Card node={this.state.node}
                            onUpdate={this.props.onUpdate}
                            variables={variables}
                        />
            case 'capture':
                return <Capture node={this.state.node} onUpdate={this.props.onUpdate} variables={variables}/>
            case 'flow':
                return <Diagram node={this.state.node}
                    onUpdate={this.props.onUpdate}
                    variables={this.props.variables}
                    createDiagram={this.props.createDiagram}
                    diagrams={this.props.diagrams}
                    enterFlow={this.props.enterFlow}
                />
            case 'api':
                return <API node={this.state.node} onUpdate={this.props.onUpdate} variables={variables}/>
            case 'payment':
                return <Payment node={this.state.node}
                    onUpdate={this.props.onUpdate}
                    history={this.props.history}
                    createProduct={this.props.createProduct}
                    editProduct={this.props.editProduct}
                    products={this.props.products}
                    onError={this.showErrorPopup}
                    skill_id={this.props.skill.skill_id}
                />
            case 'cancel':
                return <CancelPayment node={this.state.node}
                    onUpdate={this.props.onUpdate}
                    createProduct={this.props.createProduct}
                    editProduct={this.props.editProduct}
                    products={this.props.products}
                    onError={this.showErrorPopup}
                    skill_id={this.props.skill.skill_id}
                />
            case 'module':
                return <Module node={this.state.node} onUpdate={this.props.onUpdate} variables={variables} user_modules={this.props.user_modules}/>
            case 'mail':
                return <Mail node={this.state.node} onUpdate={this.props.onUpdate} variables={variables} templates={this.props.templates} skill={this.props.skill}/>
            case 'display':
                return <Display node={this.state.node} onUpdate={this.props.onUpdate} variables={variables} displays={this.props.displays} skill={this.props.skill}/>
            case 'stream':
                return <Stream node={this.state.node} onUpdate={this.props.onUpdate} diagramEngine={this.props.diagramEngine} forceRepaint={this.props.forceRepaint} repaint={this.props.repaint}/>
            case 'permissions':
                return <Permissions node={this.state.node} onUpdate={this.props.onUpdate} variables={variables} products={this.props.products} live_mode={this.props.live_mode}/>
            case 'exit':
                return <Alert>This block ends the skill in its current flow and state</Alert>
            case 'reminder':
                return <Reminder node={this.state.node} onUpdate={this.props.onUpdate} variables={variables}/>
            case 'permission':
                return <PermissionCard node={this.state.node} onUpdate={this.props.onUpdate} skill={this.props.skill} live_mode={this.props.live_mode}/>
            case 'code':
                return <Code node={this.state.node} onUpdate={this.props.onUpdate} variables={variables}/>
            default:
              return null
        }
    }

    renderTitle(){
        switch(this.state.node.extras.type) {
            case 'story':
                return (<div id="label">Start Block</div>)
            case 'module':
                return (<div id="label">{this.state.node.name}</div>)
            case 'flow':
                if(this.state.node.extras.diagram_id){
                    let block = this.props.diagrams.find(d => d.id === this.state.node.extras.diagram_id)
                    if(block && block.name !== this.state.node.name){
                        let node = this.state.node
                        node.name = block.name
                    }
                    return <div id="label">
                        {block ? block.name : 'New Flow'}
                    </div>
                }
                return <div id="label">Add Flow</div>
            default:
              return (<input id="label" placeholder="Block Label"
                    type="text"
                    name="name"
                    value={this.state.node.name}
                    onChange={this.handleChange.bind(this)}
                    onKeyPress={ (e) => {if(e.charCode===13){e.preventDefault()}}}
                />);
        }
    }

    eventHandler(e){
        if(this.props.preview){
            e.preventDefault()
            e.stopPropagation()
        }
    }

    toggleReprompt () {
        let node = this.state.node
        if(node.extras.reprompt){
            node.extras.reprompt = null
            delete node.extras.reprompt
        }else{
            node.extras.reprompt = {
                voice: 'Alexa',
                content: ''
            }
        }
        this.setState({node: node})
    }

    EditorRender(){
        let variables = this.props.global_variables.concat(this.props.variables)
        return <React.Fragment>
            {this.BlockViewer(variables)}
            {this.state.node.extras.reprompt && <React.Fragment>
                <hr/>
                <div className="space-between">
                    <label>Custom Reprompt</label>
                    <button className="close" onClick={this.toggleReprompt}>×</button>
                </div>
                <Prompt
                    placeholder="Sorry I didn't get that! Do you like this or that?"
                    voice={this.state.node.extras.reprompt.voice}
                    content={this.state.node.extras.reprompt.content}
                    updatePrompt={(prompt) => {
                        let node = this.state.node
                        if(node && node.extras && node.extras.reprompt){
                            node.extras.reprompt = {...node.extras.reprompt, ...prompt}
                            this.setState({node: node})
                        }
                    }}
                    variables={variables}
                />
            </React.Fragment>}
        </React.Fragment>
    }

    render() {
        let type = this.state.node ? this.state.node.extras.type : null
        let name = ''
        if(type){
            let find = getBlocks().find(block => block.type === type)
            if(find){
                name = find.text
            }
        }        
        if (type === 'god') {
            return null;
        }
        return (
            <div id="Editor" className={(this.props.open && type && !this.state.modal ? 'open':'')}
                onFocus={this.props.unfocus}
                onClickCapture={this.eventHandler}
                onKeyDownCapture={this.eventHandler}
                onMouseDown={this.props.unfocus}
                onKeyDown={this.props.unfocus}
            >
                {this.props.onboarding && <Onboarding finished={this.props.finished}/>}
                {type ?
                    <div className="controls" key={this.state.node.id}>
                        <div className="top">
                            <div className="property">
                                <div id="close-editor" className="close" onClick={this.props.close}>&times;</div>
                                <div className="d-flex">
                                    <div className={"block " + type} onClick={() => this.props.setHelp({type: this.state.node.extras.type})}>
                                        {name} Block <i className="fas fa-question-circle mr-1"/>
                                    </div>
                                    <div className="d-flex pl-2">
                                        <div
                                            className="delete-block"
                                            onClick={()=>this.setState({
                                                expanded: true,
                                                modal: true
                                            })}
                                        >
                                            <i className="far fa-expand-arrows-alt mr-2"/>
                                        </div>
                                        <UncontrolledDropdown nav inNavbar>
                                            <DropdownToggle className="delete-block" nav tag="div">
                                                <i className="fas fa-cog"/>
                                            </DropdownToggle>
                                            <DropdownMenu right className="arrow arrow-right no-select" style={{right: '-12px', marginTop: '5px'}}>
                                                <DropdownItem header>
                                                    Block Options
                                                </DropdownItem>
                                                {['interaction','choice', 'capture'].includes(this.state.node.extras.type) && !this.state.node.extras.reprompt &&
                                                    <DropdownItem onClick={this.toggleReprompt}>
                                                        <i className="fas fa-redo text-muted"/> Reprompt
                                                    </DropdownItem>
                                                }
                                                <DropdownItem onClick={() => this.props.node.parentCombine ? this.props.appendCombineNode(this.state.node) : this.props.copyNode()} className="pointer">
                                                    <i className="fas fa-copy text-muted"/> Copy
                                                </DropdownItem>
                                                <DropdownItem onClick={() => this.props.node.parentCombine ? this.props.removeCombineNode(this.state.node) : this.props.removeNode()} className="pointer">
                                                    <i className="fas fa-file-times text-muted"/> Delete
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="editor-section">
                            {this.renderTitle()}
                            {!this.state.expanded ? this.EditorRender() : <div className="text-center mt-5"><span className="loader text-lg"></span></div>}
                            {this.state.expanded &&
                                <React.Fragment>
                                    <Modal
                                        isOpen={this.state.modal}
                                        toggle={()=>this.setState({modal: false})}
                                        onClosed={()=>this.setState({expanded: false})}
                                        size="lg"
                                    >
                                        <ModalHeader toggle={()=>this.setState({modal: false})}>{this.state.node.name} Settings</ModalHeader>
                                        <ModalBody className="pb-4 px-4">
                                            {this.EditorRender()}
                                        </ModalBody>
                                    </Modal>
                                </React.Fragment>
                            }
                        </div>
                    </div>
                : null}
            </div>
        );
    }
}

export default Editor;
