import React, { Component } from 'react'
import IntentInputs from './components/IntentInputs'
import SlotInputs from './components/SlotInputs'
import { Button, ButtonGroup, Alert } from 'reactstrap'
import ChoiceDropdownInputs from './components/ChoiceDropdownInputs'
import ErrorModal from '../../../components/Modals/ErrorModal'
import ConfirmModal from '../../../components/Modals/ConfirmModal'
import converter from 'number-to-words'
import randomstring from 'randomstring';

class Interaction extends Component {
    constructor(props) {
        super(props);

        const formatted_built_ins = this.props.built_ins.map( intent => {
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

        this.state = {
            intents: this.props.intents,
            slots: this.props.slots,
            node: this.props.node,
            tab: 'choices',
            error: null,
            built_ins: formatted_built_ins,
            confirm: null
        }

        this.handleIntentsChange = this.handleIntentsChange.bind(this)
        this.handleAddIntent = this.handleAddIntent.bind(this)
        this.handleRemoveIntent = this.handleRemoveIntent.bind(this)

        this.handleSlotsChange = this.handleSlotsChange.bind(this)
        this.handleAddSlot = this.handleAddSlot.bind(this)
        this.handleRemoveSlot = this.handleRemoveSlot.bind(this)

        this.handleChoicesChange = this.handleChoicesChange.bind(this)
        this.handleAddChoice = this.handleAddChoice.bind(this)
        this.handleRemoveChoice = this.handleRemoveChoice.bind(this)

        this.showErrorPopup = this.showErrorPopup.bind(this)
        this.update = this.update.bind(this)
    }

    update(){
        this.forceUpdate()
        this.props.onUpdate()
    }

    _getIndex(index) {
        return converter.toWords(index).replace(/\s/g, '_').replace(/,/g,'').replace(/-/g,'_')
    }

    handleIntentsChange(intents) {
        this.setState({
            intents: intents
        }, () => {this.props.onIntent(intents)});
    }

    handleSlotsChange(slots) {
        this.setState({
            slots: slots,
        },  () => {this.props.onSlot(slots)});
    }

    handleAddIntent() {
        const intents = this.state.intents;

        let name = 'intent_' + this._getIndex(intents.length+1)

        const find = (name) => intents.find(e => e.name === name)
        while(find(name)) {
            name = 'new_' + name
        }

        intents.push({name: name, inputs: [], key: randomstring.generate(12), open: true});

        this.setState({
            intents: intents,
        }, () => {this.props.onIntent(intents)});
    }

    handleAddSlot(e) {
        const slots = this.state.slots;

        let name = 'slot_' + this._getIndex(slots.length+1)

        const find = (name) => slots.find(e => e.name === name)
        while(find(name)) {
            name = 'new_' + name
        }

        slots.push({name: name, inputs: [], type: '', key: randomstring.generate(12), open: true})

        this.setState({
            slots: slots,
        }, () => {this.props.onSlot(slots)});
    }

    handleRemoveIntent(key) {
        this.setState({
            confirm: {
                text: <Alert color="warning" className="mb-0">Make sure this Intent isn't used in any Command or Intent blocks<br/>-<br/>Deleting may cause unexpected behavior</Alert>,
                confirm: () => {
                    const intents = this.state.intents
                    let i = intents.findIndex(i => i.key === key)
                    if(i !== -1){
                        intents.splice(i, 1)
                        this.setState({
                            confirm: null,
                            intents: intents,
                         }, () => {this.props.onIntent(intents)})
                    }
                }
            }
        })
    }

    handleRemoveSlot(key) {
        const slots = this.state.slots
        const used_slots = new Set();
        const slot_names = {}

        this.state.intents.forEach(intent => {
            const utterances = intent.inputs
            utterances.forEach( u => u.slots.forEach(s => {
                used_slots.add(s)
                slot_names[s] = intent.name
            }))
        })

        if (used_slots.has(key)) {
            const error = `Cannot remove slot as it is currently being used in an intent (${slot_names[key]})!`
            this.setState({
                error: error
            })
        } else {
            let i = slots.findIndex(i => i.key === key)
            if(i !== -1){
                slots.splice(i, 1);
                this.setState({
                    slots: slots
                }, () => {this.props.onSlot(slots)});
            }
        }
    }

    handleChoicesChange(choices) {
        const node = this.state.node
        node.extras.choices = choices

        this.setState({
            node: node
        })
        this.props.onUpdate()
    }

    handleAddChoice() {
        const node = this.state.node
        const choices = node.extras.choices

        choices.push({intent: null, mappings: [], key: randomstring.generate(12), open: true})

        let test = node.addOutPort(node.extras.choices.length);
        test.setMaximumLinks(1);

        this.setState({
            node: node
        })
        this.props.onUpdate()
        this.props.repaint()
    }

    handleRemoveChoice(i) {
        const node = this.state.node;
        const choices = node.extras.choices

        for (var name in node.getPorts()) {
            var port = node.getPort(name)

            if (port.label === node.extras.choices.length) {
                node.removePort(port)
                break
            }
        }

        choices.splice(i, 1)

        this.setState({
            node: node,
        })
        this.props.onUpdate()
        this.props.repaint()
    }

    showErrorPopup(message) {
        this.setState({
            error: message
        })
    }

    render() {
        const renderChoices = () => {
            return (
                <div>
                    <label>
                        Choices
                    </label>
                    <ChoiceDropdownInputs
                        choices={this.state.node.extras.choices}
                        locked={this.props.locked}
                        onAdd={this.handleAddChoice}
                        onRemove={this.handleRemoveChoice}
                        onChange={this.handleChoicesChange}
                        intents={this.state.intents}
                        variables={this.props.variables}
                        slots = {this.state.slots}
                        built_ins={this.state.built_ins}
                        onError={this.showErrorPopup}
                    />
                </div>
            )
        }

        const renderIntents = () => {
            return (
                <div>
                    <label>
                        Intents
                    </label>
                    <IntentInputs
                        intents={this.state.intents}
                        locked={this.props.locked}
                        onAdd={this.handleAddIntent}
                        onRemove={this.handleRemoveIntent}
                        slots = {this.state.slots}
                        onError={this.showErrorPopup}
                        update={this.update}
                    />
                </div>
            )
        }

        const renderSlots = () => {
            return (
                <div>
                    <label>
                        Slots
                    </label>
                    <SlotInputs
                        slots = {this.state.slots}
                        locked={this.props.locked}
                        onAdd={this.handleAddSlot}
                        onRemove={this.handleRemoveSlot}
                        onChange={this.handleSlotsChange}
                        slot_types = {this.props.slot_types}
                        onError={this.showErrorPopup}
                        update={this.update}
                    />
                </div>
            )
        }

        return (
            <React.Fragment>
                <ConfirmModal confirm={this.state.confirm} toggle={()=>this.setState({confirm: null})}/>
                <ErrorModal error={this.state.error} dismiss={()=>this.setState({error: null})}/>
                <ButtonGroup className="toggle-group mb-2">
                    <Button outline={this.state.tab !== 'choices'} onClick={() => {this.setState({tab: 'choices'})}} disabled={this.state.tab === 'choices'}> Choices </Button>
                    <Button outline={this.state.tab !== 'intents'} onClick={() => {this.setState({tab: 'intents'})}} disabled={this.state.tab === 'intents'}> Intents </Button>
                    <Button outline={this.state.tab !== 'slots'} onClick={() => {this.setState({tab: 'slots'})}} disabled={this.state.tab === 'slots'}> Slots </Button>
                </ButtonGroup>
                {this.state.tab === 'choices' && renderChoices()}
                {this.state.tab === 'intents' && renderIntents()}
                {this.state.tab === 'slots' && renderSlots()}
            </React.Fragment>
        );
    }
}

export default Interaction;
