import React, { Component } from 'react'
import IntentInputs from './components/IntentInputs'
import SlotInputs from './components/SlotInputs'
import { Button, ButtonGroup, InputGroup, Input } from 'reactstrap'
import {Tooltip} from 'react-tippy'
import Select from 'react-select'
import SlotMappings from './components/SlotMappings' 
const _ = require('lodash')

class Command extends Component {

    constructor(props) {
        super(props)

        this.state = {
            node: this.props.node,
            tab: 'command'
        }
        
        this.renderTab = this.renderTab.bind(this)
        this.updateCommand = this.updateCommand.bind(this)
        this.updateResume = this.updateResume.bind(this)
        this.update = this.update.bind(this)
    }

    updateResume(){
        let node = this.state.node
        node.extras.resume = !this.state.node.extras.resume
        if(node.extras.resume){
            // no ports
            for (var name in node.getPorts()) {
                var port = node.getPort(name);
                node.removePort(port)
            }
        }else{
            node.addOutPort(' ').setMaximumLinks(1)
        }
        this.forceUpdate()
        this.props.repaint()
    }

    updateCommand(selected) {
        if(Array.isArray(selected)) {
            return
        }
        this.props.node.extras.intent = selected
        if(!Array.isArray(this.props.node.extras.mappings)){
            this.props.node.extras.mappings = []
        }
        this.props.node.extras.mappings = this.props.node.extras.mappings.map(m => {
            return {
                variable: m.variable,
                slot: null
            }
        })
        this.update()
    }

    update(){
        this.forceUpdate()
        this.props.onUpdate()
    }

    static getDerivedStateFromProps(props) {
        let node = props.node

        if(!node.extras){
            node.extras = {
                intent: null,
                mappings: []
            }
        }else if(node.extras.intent){
            let command = node.extras
            let intent = _.find(props.intents, { key:  command.intent.key})
            if(intent){
                command.intent = {
                    label: intent.name,
                    value: intent.key,
                    key: intent.key,
                    inputs: intent.inputs
                }
            }
            if(Array.isArray(command.mappings)){
                // update labels TODO make this whole thing more efficient
                command.mappings.forEach(mapping => {
                    if(mapping.slot && mapping.slot.key){
                        let slot = _.find(props.slots, {key: mapping.slot.key})
                        if(slot){
                            mapping.slot.label = '['+slot.name+']'
                        }
                    }
                })
            }
        }
        return {
            node: node
        }
    }

    command(){
        let command = this.state.node.extras
        if(!command) return null

        let slots
        if(command.intent && command.intent.inputs){
            slots = command.intent.inputs.map(e => e.slots)

            // TODO: PLEASE MAKE THIS MORE EFFICIENT - CHECK IF THIS INTENT HAS NO SLOTS
            let has_slots = false
            for(var slot of slots){
                if(slot.length !== 0){
                    has_slots = true
                    break 
                }
            }
            if(!has_slots){
                slots = null
            }
        }

        let options
        let diagram_name
        if(this.state.node.extras.resume){
            // has an attached diagram
            if(this.state.node.extras.diagram_id){
                let find = this.props.diagrams.find(d => d.id === this.state.node.extras.diagram_id)
                if(find){
                    diagram_name = find.name
                }
            }else{
                // doesn't have an attached diagram
                options = this.props.diagrams
                .filter(diagram => (diagram.name !== 'ROOT' && diagram.id !== this.props.current))
                .map(diagram => {
                    return {
                        value: diagram.id,
                        label: diagram.name
                    }
                })
            }
        }

        return <React.Fragment>
            <label>
                Command Intent
            </label>
            <div className="super-center flex-hard">
                <Select
                    placeholder="Select Intent"
                    className="select-box mb-1"
                    classNamePrefix="select-box"
                    value={command.intent}
                    onChange={this.updateCommand}
                    options={this.props.intents.concat(this.props.built_ins).map(intent => {
                        return {label: intent.name, value: intent.key, key: intent.key, inputs: intent.inputs, built_in: intent.built_in}
                    })}
                />
            </div>
            {!!slots && 
                <React.Fragment>
                    <hr/>
                    <div className="diagram-title">Slot Mapping</div>
                    <SlotMappings
                        variables={this.props.variables}
                        slot_options={slots}
                        slots={this.props.slots}
                        arguments={command.mappings}
                        update={this.update}
                    />
                </React.Fragment>
            }
            <InputGroup className="my-3">
                <label className="input-group-text w-100 m-0 d-flex">
                    <Input addon type="checkbox" value={this.state.node.extras.resume} checked={this.state.node.extras.resume} onChange={this.updateResume}/>
                    <div className="ml-2 space-between flex-hard">
                        <span>
                            Resume from Previous Block
                        </span>
                        <span>
                            <Tooltip
                                className="menu-tip"
                                title='When this option is checked, on completion of the command users will resume the skill from the block where they invoked the command'
                                position="bottom"
                                theme="block"
                            >
                                ?
                            </Tooltip>
                        </span>
                    </div>
                </label>
            </InputGroup>
            {this.state.node.extras.resume && <div className="choice-block py-4">
                {this.state.node.extras.diagram_id ? 
                    <React.Fragment>
                        <h5><span className="text-muted"><i className="fas fa-long-arrow-right mr-2"/>{diagram_name}</span></h5>
                        <Button block className="mt-3" onClick={() => this.props.enterFlow(this.state.node.extras.diagram_id)}>Enter Flow</Button>
                        <Button block className="mt-2" onClick={() => {let node = this.state.node; node.extras.diagram_id=null; this.setState({node: node})}} color="clear">Unlink Flow</Button>
                    </React.Fragment> :
                    <React.Fragment>
                        <h5 className="mb-0">Command Flow</h5>
                        <label>Create a New Flow</label>
                        <Button className="btn-primary btn-block btn-lg" onClick={() => this.props.createDiagram(this.state.node, (this.state.node.name ? this.state.node.name : 'Command Flow'))}>
                            Create New Flow <i className="fas fa-sign-in"/>
                        </Button>
                        <hr className="mb-1"/>
                        {this.props.diagrams && this.props.diagrams.length > 0 ? 
                            <React.Fragment>
                                <label>Select Existing Flow</label>
                                <Select
                                    classNamePrefix="select-box"
                                    onChange={(selected) => {
                                        let node = this.state.node;
                                        node.extras.diagram_id = selected.value;
                                        this.props.enterFlow(selected.value);
                                    }}
                                    options={options}
                                />
                            </React.Fragment>
                        : null}
                    </React.Fragment>
                }
            </div>}
        </React.Fragment>
    }

    renderTab(){
        switch(this.state.tab){
            case 'command':
                return this.command()
            case 'intents':
                return <React.Fragment>
                    <label>
                        Intents
                    </label>
                    <IntentInputs
                        intents={this.props.intents}
                        onAdd={this.props.handleAddIntent}
                        onRemove={this.props.handleRemoveIntent}
                        slots={this.props.slots}
                        onError={this.props.onError}
                        update={this.update}
                        onConfirm={this.props.onConfirm}
                    />
                </React.Fragment>
            case 'slots':
                return <React.Fragment>
                    <label>
                        Slots
                    </label>
                    <SlotInputs
                        slots={this.props.slots}
                        slot_types={this.props.slot_types}
                        onError={this.props.onError}
                        update={this.update}
                    />
                </React.Fragment>
            default:
                return null
        }
    }

    render(){
        return <React.Fragment>
            <ButtonGroup className="toggle-group mb-2">
                <Button outline={this.state.tab !== 'command'} onClick={() => {this.setState({tab: 'command'})}} disabled={this.state.tab === 'command'}> Command </Button>
                <Button outline={this.state.tab !== 'intents'} onClick={() => {this.setState({tab: 'intents'})}} disabled={this.state.tab === 'intents'}> Intents </Button>
                <Button outline={this.state.tab !== 'slots'} onClick={() => {this.setState({tab: 'slots'})}} disabled={this.state.tab === 'slots'}> Slots </Button>
            </ButtonGroup>
            {this.renderTab()}
        </React.Fragment>
    }
}

export default Command