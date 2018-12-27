import _ from 'lodash';
import React, { Component } from 'react';
import axios from 'axios';
import Line from './Editors/Line';
import Choice from './Editors/Choice';
import Jump from './Editors/Jump'
import Interaction from './Editors/Interaction';
import Story from './Editors/Story';
import Random from './Editors/Random';
import Variable from './Editors/Variable';
import SetBlock from './Editors/Set';
import IfBlock from './Editors/If';
import OldIfBlock from './Editors/OldIf';
import Speak from './Editors/Speak';
import OldSpeak from './Editors/OldSpeak';
import Capture from './Editors/Capture';
import OldCommand from './Editors/OldCommand';
import Command from './Editors/Command';
import Diagram from './Editors/Diagram';
import API from './Editors/API';
import Module from './Editors/Module';
import Mail from './Editors/Mail';
import Stream from './Editors/Stream';
import Permissions from './Editors/Permissions';
import Onboarding from './Onboarding'
import {
    Modal, ModalBody, ModalHeader,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

import { SLOT_TYPES_MAP, BUILT_IN_INTENTS } from './Constants'

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
            permission_options: [],
            modal: false,
            expanded: false,
            error: null,
            confirm: null
        }

        this.eventHandler = this.eventHandler.bind(this)
        this.getSlotTypes = this.getSlotTypes.bind(this)
        this.BlockViewer = this.BlockViewer.bind(this)
        this.renderTitle = this.renderTitle.bind(this)
    }

    componentDidMount() {
        axios.get('/email/templates')
        .then(res => {
            let templates = res.data.map(t => {
                let variables = [];
                if(t.variables){
                    try{
                        variables = JSON.parse(t.variables);
                    }catch(err){
                        console.error(err);
                    }
                }

                return {
                    title: t.title,
                    sender: t.sender,
                    template_id: t.template_id,
                    variables: variables
                }
            })
            this.setState({
                templates: templates
            })
        })
        .catch(err => {
            window.alert('Couldn\'t Retrieve Templates');
        })

        // Hard-code for now, but eventually should retrieve from
        // AMZN website if possible

        this.setState({
            permission_options: [
                { name: 'User Email', value: 'alexa::profile:email:read' },
                { name: 'User Name', value: 'alexa::profile:name:read' },
                { name: 'User Phone Number', value: 'alexa::profile:mobile_number:read' },
                // { name: 'Amazon Pay', value: 'payments:autopay_consent' }
                // Removed for now, amazon pay permissions broken
            ]
        })
    }

    componentWillReceiveProps(props) {
        this.setState({
            node: props.node
        })
    }

    handleChange(e, key = undefined) {
        var node = this.state.node
        var name = e.target.getAttribute('name')
        var value = e.target.value
        node[name] = value
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
        return _.uniq(_.flatten(SLOT_TYPES))
    }

    BlockViewer() {
        let variables = this.props.global_variables.concat(this.props.variables)

        switch(this.state.node.extras.type) {
            case 'story':
                return <Story/>;
            case 'choice':
            case 'choicenew':
                return <Choice
                        node={this.state.node}
                        onUpdate={this.props.onUpdate}
                        repaint={this.props.repaint}
                    />
            case 'jump':
                return <Jump
                        node={this.state.node}
                        onUpdate={this.props.onUpdate}
                        intents={this.props.intents}
                        slots={this.props.slots}
                        variables={variables}
                        slot_types={this.getSlotTypes(this.props.locales)}
                        built_ins={BUILT_INS}
                        onError={this.props.onError}
                        onConfirm={this.props.onConfirm}
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
                    />
                }
            case 'intent':
                return <Interaction 
                    node={this.state.node} 
                    onUpdate={this.props.onUpdate} 
                    repaint={this.props.repaint} 
                    intents={this.props.intents} 
                    slots={this.props.slots} 
                    onSlot={this.props.onSlot} 
                    onIntent={this.props.onIntent} 
                    variables={variables} 
                    slot_types={this.getSlotTypes(this.props.locales)}
                    built_ins={BUILT_INS} 
                    onError={this.props.onError}
                    onConfirm={this.props.onConfirm}
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
                    return <IfBlock node={this.state.node} variables={variables} onUpdate={this.props.onUpdate} repaint={this.props.repaint}/>
                }else{
                    return <OldIfBlock node={this.state.node} variables={variables} onUpdate={this.props.onUpdate} repaint={this.props.repaint}/>
                }
            case 'random':
                return <Random node={this.state.node} onUpdate={this.props.onUpdate} repaint={this.props.repaint}/>
            case 'speak':
                // DEPRECATE OLD SPEAK BLOCKS
                if(this.state.node.extras.raw !== undefined){
                    return <OldSpeak node={this.state.node} onUpdate={this.props.onUpdate} variables={variables}/>
                } else {
                    return <Speak node={this.state.node} onUpdate={this.props.onUpdate} variables={variables}/>
                }
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
            case 'module':
                return <Module node={this.state.node} onUpdate={this.props.onUpdate} variables={variables} user_modules={this.props.user_modules}/>
            case 'mail':
                return <Mail node={this.state.node} onUpdate={this.props.onUpdate} variables={variables} templates={this.state.templates}/>
            case 'stream':
                return <Stream node={this.state.node} onUpdate={this.props.onUpdate} repaint={this.props.repaint}/>
            case 'permissions':
                return <Permissions node={this.state.node} onUpdate={this.props.onUpdate} variables={variables} permission_options={this.state.permission_options}/>
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

    render() {
        const type = this.state.node ? this.state.node.extras.type : null

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
                                        {type} block <i className="fas fa-question-circle mr-1"/>
                                    </div>
                                    <div className="d-flex pl-2">
                                        <div
                                            className="delete-block"
                                            onClick={()=>this.setState({
                                                expanded: true,
                                                modal: true
                                            })}
                                        >
                                            <i className="far fa-expand-arrows-alt"/>
                                        </div>
                                        <UncontrolledDropdown nav inNavbar>
                                            <DropdownToggle className="delete-block" nav tag="div">
                                                <i className="fas fa-cog"/>
                                            </DropdownToggle>
                                            <DropdownMenu right className="arrow arrow-right no-select" style={{right: '-3px', marginTop: '5px'}}>
                                                <DropdownItem header>
                                                    Block Options
                                                </DropdownItem>
                                                {/*this.state.node.extras.type === 'flow' &&
                                                    <DropdownItem onClick={this.copyFlow}>Copy Flow</DropdownItem>*/
                                                }
                                                <DropdownItem onClick={this.props.copyNode} className="pointer">
                                                    <i className="fas fa-copy text-muted"/> Copy
                                                </DropdownItem>
                                                <DropdownItem onClick={this.props.removeNode} className="pointer">
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
                            {!this.state.expanded ? this.BlockViewer() : <div className="text-center mt-5"><span className="loader text-lg"></span></div>}
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
                                            {this.BlockViewer()}
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
