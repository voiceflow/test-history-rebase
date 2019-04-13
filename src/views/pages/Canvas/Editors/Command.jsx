import React, { Component } from 'react'
import { connect } from 'react-redux'
import IntentInputs from './components/IntentInputs'
import SlotInputs from './components/SlotInputs'
import { Button, ButtonGroup, Alert } from 'reactstrap'
import Select, { components } from 'react-select'
import SlotMappings from './components/SlotMappings'
import PlatformTooltip from '../../../components/Tooltips/PlatformTooltip';
import { PLATFORMS } from '../../../../Constants'
import { updateIntents, setCanFulfill } from "./../../../../actions/versionActions";
import { setError } from 'actions/modalActions'

const _ = require('lodash')

export class Command extends Component {

    constructor(props) {
        super(props)

        this.intentSelectRef = React.createRef();

        this.state = {
            node: this.props.node,
            tab: 'command'
        }

        this.renderTab = this.renderTab.bind(this)
        this.updateCommand = this.updateCommand.bind(this)
        this.updateEnd = this.updateEnd.bind(this)
        this.update = this.update.bind(this)
    }

    updateEnd() {
        let node = this.state.node
        node.extras.end = !this.state.node.extras.end
        this.forceUpdate()
    }

    updateCommand(selected) {
        const extras = this.props.node.extras[this.props.platform]
        const intent = extras.intent
        const diagram_intents = this.props.diagram_level_intents[this.props.platform]

        if (Array.isArray(selected) || (intent && selected.key === intent.key)) {
            return
        }

        if (diagram_intents.has(selected.key)) {
            this.props.setError(`The ${selected.label} intent is already being handled by another Block within this flow!`)
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
        this.props.updateLinter();
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

        let options
        let diagram_name
        if (extras.resume) {
            // has an attached diagram
            if (extras.diagram_id) {
                let find = this.props.diagrams.find(d => d.id === extras.diagram_id)
                if (find) {
                    diagram_name = find.name
                }
            } else {
                // doesn't have an attached diagram
                options = this.props.diagrams
                    .filter(diagram => (diagram.name !== 'ROOT' && diagram.id !== this.props.current))
                    .map(diagram => {
                        return {
                            value: diagram.id + "::" + diagram.name,
                            label: <><img src={'/flows.svg'} alt="flows" width="15"/>&nbsp;&nbsp; {diagram.name}</>
                        }
                    })
            }
        }

        return <React.Fragment>
            <div className="d-flex justify-content-between">
                <label>
                    Command Intent
                </label>
                <PlatformTooltip platform={this.props.platform} field={'Command intents'} />
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
            <hr/>
            <div className="mt-1">
                {extras.diagram_id ?
                    <React.Fragment>
                        {diagram_name ? <React.Fragment>
                            <button block className="btn-primary btn-block btn-lg" onClick={() => this.props.enterFlow(extras.diagram_id)}>
                            <img src={"/flows-white.svg"} alt="flows" className="mr-2" /> Enter {diagram_name} Flow
                            </button>
                        </React.Fragment> : <Alert color="danger" className="text-center">
                                <i className="fas fa-exclamation-triangle fa-2x mb-2" /><br />
                                Unable to Retrieve Flow - This Flow may be broken or deleted
                        </Alert>}
                        <button block className="mt-3 btn-tertiary btn-lg btn-block btn" onClick={() => { 
                                let node = this.state.node; 
                                let extras = node.extras[this.props.platform]; extras.diagram_id = null; 
                                this.setState({ node: node })
                                this.props.repaint()
                            }} 
                            color="clear">
                            Unlink Flow
                        </button>
                    </React.Fragment> :
                    <React.Fragment>
                        <label>Link Command Flow</label>
                        <button className="btn-clear btn-block btn-lg" block onClick={() => this.props.createDiagram(this.state.node, (this.state.node.name ? this.state.node.name : 'Command Flow'), null, true)}>
                        <img className="mr-2" src={'/flows.svg'} height={15} width={15} alt="home"/> Create New Flow
                        </button>
                        <div className="break">
                        <span className="or">OR</span>
                        </div>
                        {this.props.diagrams && this.props.diagrams.length > 0 ?
                            <React.Fragment>
                                <label>Select Existing Flow</label>
                                <Select
                                    placeholder={<><img src={'/flows.svg'} alt="flows" width="15"/>&nbsp;&nbsp; Select Flow</>}
                                    classNamePrefix="select-box"
                                    onChange={(selected) => {
                                        let diagram_id = selected.value.substring(0, selected.value.indexOf("::"))
                                        PLATFORMS.forEach(p => {
                                            let extras = this.state.node.extras[p]
                                            extras.diagram_id = diagram_id;
                                        })
                                        this.props.enterFlow(diagram_id);
                                    }}
                                    options={options}
                                />
                            </React.Fragment>
                            : null}
                    </React.Fragment>
                }
            </div>
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
            case 'command':
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
        return (
            <React.Fragment>
                <ButtonGroup className="toggle-group mb-2">
                    <Button outline={this.state.tab !== 'command'} onClick={() => { this.setState({ tab: 'command' }) }} disabled={this.state.tab === 'command'}> Command </Button>
                    <Button outline={this.state.tab !== 'intents'} onClick={() => { this.setState({ tab: 'intents' }) }} disabled={this.state.tab === 'intents'}> Intents </Button>
                    <Button outline={this.state.tab !== 'slots'} onClick={() => { this.setState({ tab: 'slots' }) }} disabled={this.state.tab === 'slots'}> Slots </Button>
                </ButtonGroup>
                <div className={this.props.live_mode ? 'disabled-overlay' : ''}>
                    {this.renderTab()}
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    intents: state.skills.skill.intents,
    slots: state.skills.skill.slots,
    diagrams: state.diagrams.diagrams,
    live_mode: state.skills.live_mode,
})

const mapDispatchToProps = dispatch => {
    return {
        updateIntents: () => dispatch(updateIntents()),
        setCanFulfill: (key, val) => dispatch(setCanFulfill(key, val)),
        setError: err => dispatch(setError(err))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Command)
