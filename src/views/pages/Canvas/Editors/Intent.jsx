import React, { Component } from 'react'
import { connect } from 'react-redux'
import IntentInputs from './components/IntentInputs'
import SlotInputs from './components/SlotInputs'
import { Button, ButtonGroup } from 'reactstrap'
import { Tooltip } from 'react-tippy'
import Select, { components } from 'react-select'
import SlotMappings from './components/SlotMappings'
import './Intent.css'
import PlatformTooltip from '../../../components/Tooltips/PlatformTooltip';
import Toggle from 'react-toggle'

import { updateIntents, setCanFulfill } from 'ducks/version'
import { setConfirm, setError } from 'ducks/modal'

const _ = require('lodash')


export class Intent extends Component {

    constructor(props) {
        super(props)

        this.intentSelectRef = React.createRef();

        this.state = {
            node: this.props.node,
            tab: 'Select',
            isRoot: props.name === 'ROOT',
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
        const extras = this.props.node.extras[this.props.platform]
        const intent = extras.intent
        const diagram_intents = this.props.diagram_level_intents[this.props.platform]

        if (Array.isArray(selected) || (intent && selected.key === intent.key)) {
            return
        }
        if (diagram_intents.has(selected.key)) {
            this.props.setError(`The ${selected.label} intent is already being handled by another Block within this flow`)
        } else {
            if (intent) diagram_intents.delete(intent.key)
            extras.intent = selected
            if (!Array.isArray(extras.mappings)) {
                extras.mappings = []
            }
            extras.mappings = extras.mappings.map(m => {
                return {
                    variable: m.variable,
                    slot: null
                }
            })
            diagram_intents.add(selected.key)
            this.update()
        }
    }

    update() {
        this.forceUpdate()
        this.props.updateIntents()
        this.props.updateLinter()
    }

    static getDerivedStateFromProps(props) {
        let node = props.node
        const extras = props.node.extras[props.platform]

        if (!extras) {
            props.node.extras[props.platform] = {
                intent: null,
                mappings: []
            }
        } else if (extras.intent) {
            let intent = _.find(props.intents, { key: extras.intent.key })
            if (intent) {
                extras.intent = {
                    label: intent.name,
                    value: intent.key,
                    key: intent.key,
                    inputs: intent.inputs
                }
            }
            if (Array.isArray(extras.mappings)) {
                // update labels TODO make this whole thing more efficient
                extras.mappings.forEach(mapping => {
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
        const extras = this.props.node.extras[this.props.platform]
        const intent = extras.intent
        if (!intent) return
        const fulfilled = this.isFulfill()
        const intent_key = intent.key
        const intent_name = intent.label

        if (fulfilled) {
            const confirm_info = {
                text: `CanfulfillIntent is enabled for the "${intent_name}" intent. Turning CanFulfillIntent off for this intent will also delete any slot fulfillment values you have set for this intent.`,
                confirm: () => {
                    this.props.setCanFulfill(intent_key, !fulfilled)
                    this.props.updateIntents()
                    this.props.updateLinter()
                    this.setState({
                        confirm_info: null
                    })
                }
            }
            this.props.setConfirm(confirm_info)
        } else {
            this.props.setCanFulfill(intent_key, !fulfilled)
            this.props.updateIntents()
            this.props.updateLinter()
        }
    }

    isFulfill() {
        const extras = this.props.node.extras[this.props.platform]
        const intent = extras.intent
        if (intent) {
            const fulfillments = this.props.fulfillment
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

    command(intent_options) {
        const SlotOption = (props) => {
            const is_alexa = /AMAZON/.test(props.data.value)
            const is_google = /^actions\.intent/.test(props.data.value)

            return (
                <components.Option {...props}>
                    <div className="d-flex slot-label justify-content-between">
                        <span className="mr-2">{props.data.label}</span>
                        <span className="d-flex">
                            {is_alexa && <i className="fab fa-amazon align-self-center" />}
                            {is_google && <i className="fab fa-google align-self-center" />}
                        </span>
                    </div>
                </components.Option>
            )
        }

        const SingleValueOption = (props) => {
            const is_alexa = /AMAZON/.test(props.data.value)
            const is_google = /^actions\.intent/.test(props.data.value)

            return (
                <components.SingleValue {...props}>
                    <div className="d-flex slot-label justify-content-between">
                        <span className="mr-2">{props.data.label}</span>
                        <span className="d-flex">
                            {is_alexa && <i className="fab fa-amazon align-self-center" />}
                            {is_google && <i className="fab fa-google align-self-center" />}
                        </span>
                    </div>
                </components.SingleValue>
            )
        }

        const extras = this.props.node.extras[this.props.platform]
        const intent = extras.intent

        let slots
        if (intent && intent.inputs) {
            slots = intent.inputs.map(e => e.slots)

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
            <div className="d-flex justify-content-between">
                <label>
                    Select Intent
                </label>
                <PlatformTooltip platform={this.props.platform} field={'Intent handlers'} />
            </div>
            <div className="super-center flex-hard">
                <Select
                    ref={this.intentSelectRef}
                    placeholder="Select Intent"
                    className="select-box mb-1"
                    classNamePrefix="select-box"
                    value={intent}
                    onChange={this.updateCommand}
                    options={intent_options}
                    components={{ Option: SlotOption, SingleValue: SingleValueOption }}
                    styles={{
                        singleValue: (base) => ({ ...base, width: '100%' }),
                    }}
                    isDisabled={this.props.live_mode}
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
                        arguments={extras.mappings}
                        update={this.update}
                    />
                </React.Fragment>
            }
        </React.Fragment>
    }

    renderTab() {
        const options = this.props.intents.concat(this.props.built_ins).filter(intent => {
            if ((intent._platform === 'google' && !(this.props.platform === 'google')) || (intent._platform === 'alexa' && !(this.props.platform === 'alexa'))) {
                return null
            } else {
                return intent
            }
        }).map(intent => {
            let split = intent.name.split('.')
            let label = split[split.length - 1]

            return { label: label, value: intent.name, key: intent.key, inputs: intent.inputs, built_in: intent.built_in }
        })

        switch (this.state.tab) {
            case 'Select':
                return this.command(options)
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
                        update={this.update}
                        platform={this.props.platform}
                        live_mode={this.props.live_mode}
                        setCanFulfill={this.props.setCanFulfill}
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
                        update={this.update}
                        platform={this.props.platform}
                        live_mode={this.props.live_mode}
                    />
                </React.Fragment>
            default:
                return null
        }
    }

    render() {
        const checked = this.isFulfill()
        const extras = this.props.node.extras[this.props.platform]
        const intent = extras.intent

        return (
            <React.Fragment>
                <ButtonGroup className="toggle-group mb-2">
                    <Button outline={this.state.tab !== 'Select'} onClick={() => { this.setState({ tab: 'Select' }) }} disabled={this.state.tab === 'Select'}> Select </Button>
                    <Button outline={this.state.tab !== 'intents'} onClick={() => { this.setState({ tab: 'intents' }) }} disabled={this.state.tab === 'intents'}> Intents </Button>
                    <Button outline={this.state.tab !== 'slots'} onClick={() => { this.setState({ tab: 'slots' }) }} disabled={this.state.tab === 'slots'}> Slots </Button>
                </ButtonGroup>
                <div className={this.props.live_mode ? 'disabled-overlay' : null}>
                    {this.renderTab()}
                    {!(this.props.platform === 'google') && this.state.isRoot && intent && this.state.tab === 'Select' && <hr />}
                    {!(this.props.platform === 'google') && this.state.isRoot && intent && this.state.tab === 'Select' && 
                        <div>
                            <div className="mb-2 d-flex">
                                <Toggle
                                    icons={false}
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
                                this.props.history.push(`/settings/${this.props.skill_id}/discovery/canfulfill/${this.state.node.extras.intent ? this.state.node.extras.intent.key : ''}`)
                            }}>
                                <span className="slot-fulfillment"><i className="fas fa-comment-alt-check mr-2"></i> Slot Fulfillment </span>
                            </button>}
                        </div>
                    }
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    live_mode: state.skills.live_mode,
    skill_id: state.skills.skill.skill_id,
    fulfillment: state.skills.skill.fulfillment,
    intents: state.skills.skill.intents,
    slots: state.skills.skill.slots,
    name: state.diagrams.diagrams.find(d => d.id === state.skills.skill.diagram).name
})

const mapDispatchToProps = dispatch => {
    return {
        updateIntents: () => dispatch(updateIntents()),
        setCanFulfill: (key, val) => dispatch(setCanFulfill(key, val)),
        setConfirm: (confirm) => dispatch(setConfirm(confirm)),
        setError: err => dispatch(setError(err)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Intent)