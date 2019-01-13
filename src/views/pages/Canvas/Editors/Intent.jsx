import React, { Component } from 'react'
import IntentInputs from './components/IntentInputs'
import SlotInputs from './components/SlotInputs'
import { Button, ButtonGroup } from 'reactstrap'
import { Tooltip } from 'react-tippy'
import Select from 'react-select'
import SlotMappings from './components/SlotMappings'
import './Intent.css'
import Switch from '@material-ui/core/Switch'

const _ = require('lodash')


class Intent extends Component {

    constructor(props) {
        super(props)

        this.intentSelectRef = React.createRef();

        let name = this.props.diagrams.find(d => d.id === this.props.diagram_id).name

        this.state = {
            node: this.props.node,
            tab: 'Select',
            isRoot: name === 'ROOT',
            confirm_info: null
        }

        this.renderTab = this.renderTab.bind(this)
        this.updateCommand = this.updateCommand.bind(this)
        this.update = this.update.bind(this)
        this.toggleCanFulfill = this.toggleCanFulfill.bind(this)
        this.isFulfill = this.isFulfill.bind(this)
        this.hasSlots = this.hasSlots.bind(this)
    }

    updateCommand(selected) {
        if (Array.isArray(selected) || (this.props.node.extras.intent && selected.key === this.props.node.extras.intent.key)) {
            return
        }

        if (this.props.diagram_level_intents.has(selected.key)) {
            this.props.onError(`The ${selected.label} intent is already being handled by another Intent Block within this flow!`)
            this.intentSelectRef.current.blur();
        } else {
            const current_intent = this.props.node.extras.intent
            if (current_intent) this.props.diagram_level_intents.delete(current_intent.key)

            this.props.node.extras.intent = selected
            this.props.diagram_level_intents.add(selected.key)
            if (!Array.isArray(this.props.node.extras.mappings)) {
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
    }

    update() {
        this.forceUpdate()
        this.props.onUpdate()
    }

    static getDerivedStateFromProps(props) {
        let node = props.node

        if (!node.extras) {
            node.extras = {
                intent: null,
                mappings: []
            }
        } else if (node.extras.intent) {
            let command = node.extras
            let intent = _.find(props.intents, { key: command.intent.key })
            if (intent) {
                command.intent = {
                    label: intent.name,
                    value: intent.key,
                    key: intent.key,
                    inputs: intent.inputs
                }
            }
            if (Array.isArray(command.mappings)) {
                // update labels TODO make this whole thing more efficient
                command.mappings.forEach(mapping => {
                    if (mapping.slot && mapping.slot.key) {
                        let slot = _.find(props.slots, { key: mapping.slot.key })
                        if (slot) {
                            mapping.slot.label = '[' + slot.name + ']'
                        }
                    }
                })
            }
        }
        return {
            node: node
        }
    }

    toggleCanFulfill() {
        const intent = this.state.node.extras.intent
        if (!intent) return
        const fulfilled = this.isFulfill()
        const intent_key = intent.key
        const intent_name = intent.label

        if (fulfilled) {
            const confirm_info = {
                text: `CanfulfillIntent is enabled for the "${intent_name}" intent. Turning CanFulfillIntent off for this intent will also delete any slot fulfillment values you have set for this intent.`,
                confirm: () => {
                    this.props.setCanFulfill(intent_key, !fulfilled)
                    this.props.onUpdate()
                    this.setState({
                        confirm_info: null
                    })
                }
            }
            this.props.onConfirm(confirm_info)
        } else {
            this.props.setCanFulfill(intent_key, !fulfilled)
            this.props.onUpdate()
        }
    }

    isFulfill() {
        const intent = this.state.node.extras.intent
        if (intent) {
            const fulfillments = this.props.skill.fulfillment
            return !!fulfillments[intent.key]
        }
        return false
    }

    hasSlots(intent) {
        for (let i = 0; i < intent.inputs.length; i++) {
            const input = intent.inputs[i]
            if (input.slots && input.slots.length > 0) {
                return true
            }
        }
        return false
    }

    command() {
        let command = this.state.node.extras
        if (!command) return null

        let slots
        if (command.intent && command.intent.inputs) {
            slots = command.intent.inputs.map(e => e.slots)

            // TODO: PLEASE MAKE THIS MORE EFFICIENT - CHECK IF THIS INTENT HAS NO SLOTS
            let has_slots = false
            for (var slot of slots) {
                if (slot.length !== 0) {
                    has_slots = true
                    break
                }
            }
            if (!has_slots) {
                slots = null
            }
        }

        return <React.Fragment>
            <label>
                Select Intent
            </label>
            <div className="super-center flex-hard">
                <Select
                    ref={this.intentSelectRef}
                    placeholder="Select Intent"
                    className="select-box mb-1"
                    classNamePrefix="select-box"
                    value={command.intent}
                    onChange={this.updateCommand}
                    options={this.props.intents.concat(this.props.built_ins).map(intent => {
                        return { label: intent.name, value: intent.key, key: intent.key, inputs: intent.inputs, built_in: intent.built_in }
                    })}
                />
            </div>
            {!!slots &&
                <React.Fragment>
                    <hr />
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

    renderTab() {
        switch (this.state.tab) {
            case 'Select':
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

    render() {

        const checked = this.isFulfill()

        return <React.Fragment>
            <ButtonGroup className="toggle-group mb-2">
                <Button outline={this.state.tab !== 'Select'} onClick={() => { this.setState({ tab: 'Select' }) }} disabled={this.state.tab === 'Select'}> Select </Button>
                <Button outline={this.state.tab !== 'intents'} onClick={() => { this.setState({ tab: 'intents' }) }} disabled={this.state.tab === 'intents'}> Intents </Button>
                <Button outline={this.state.tab !== 'slots'} onClick={() => { this.setState({ tab: 'slots' }) }} disabled={this.state.tab === 'slots'}> Slots </Button>
            </ButtonGroup>
            {this.renderTab()}
            {this.state.isRoot && this.state.node.extras.intent && <hr />}
            {this.state.isRoot && this.state.node.extras.intent &&
                <div>
                    <div className="mb-2 d-flex">
                        <Switch
                            name="fulfill_toggle"
                            checked={checked}
                            onChange={this.toggleCanFulfill}
                            color="primary"
                            className="fulfill-switch"
                        />
                        <div className="ml-2 w-100 fulfill-label va">Can Fulfill Intent</div>
                        <div className="va">
                            <Tooltip
                                className="menu-tip"
                                title='Handle CanFulfillIntent Requests with this block. If your intent has slots, use Slot Fulfillment" to specify which slots your skill is able to handle'
                                position="bottom"
                                theme="block"
                            >
                                ?
                        </Tooltip></div>

                    </div>
                    {checked && this.state.node.extras.intent && this.hasSlots(this.state.node.extras.intent) && <button className="btn btn-clear btn-shadow w-100 my-2 d-flex space-between fulfill-label" onClick={() => {
                        this.props.history.push(`/settings/${this.props.skill.skill_id}/discovery/canfulfill/${this.state.node.extras.intent ? this.state.node.extras.intent.key : ''}`)
                    }}>
                        <span className="slot-fulfillment"><i className="fas fa-comment-alt-check mr-2"></i> Slot Fulfillment </span>
                    </button>}
                </div>
            }

        </React.Fragment>
    }
}

export default Intent