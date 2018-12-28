import React, { Component } from 'react'
import IntentInputs from './components/IntentInputs'
import SlotInputs from './components/SlotInputs'
import { Button, ButtonGroup } from 'reactstrap'
import Select from 'react-select'
import SlotMappings from './components/SlotMappings' 
const _ = require('lodash')

class Jump extends Component {

    constructor(props) {
        super(props)

        this.state = {
            node: this.props.node,
            tab: 'jump'
        }
        
        this.renderTab = this.renderTab.bind(this)
        this.updateCommand = this.updateCommand.bind(this)
        this.update = this.update.bind(this)
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

        return <React.Fragment>
            <label>
                Jump Intent
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
        </React.Fragment>
    }

    renderTab(){
        switch(this.state.tab){
            case 'jump':
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
                        intents={this.props.intents}
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
                <Button outline={this.state.tab !== 'jump'} onClick={() => {this.setState({tab: 'jump'})}} disabled={this.state.tab === 'jump'}> Jump </Button>
                <Button outline={this.state.tab !== 'intents'} onClick={() => {this.setState({tab: 'intents'})}} disabled={this.state.tab === 'intents'}> Intents </Button>
                <Button outline={this.state.tab !== 'slots'} onClick={() => {this.setState({tab: 'slots'})}} disabled={this.state.tab === 'slots'}> Slots </Button>
            </ButtonGroup>
            {this.renderTab()}
        </React.Fragment>
    }
}

export default Jump