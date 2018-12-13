import React, { Component } from 'react'
import IntentInputs from './components/IntentInputs'
import SlotInputs from './components/SlotInputs'
import { Button, ButtonGroup } from 'reactstrap'
import ChoiceDropdownInputs from './components/ChoiceDropdownInputs'
import ErrorModal from '../../../components/Modals/ErrorModal'
import converter from 'number-to-words'

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
            intents_open: this.props.intents_open,
            slots_open: this.props.slots_open,
            node: this.props.node,
            tab: 'choices',
            error: null,
            built_ins: formatted_built_ins
        };
        
        this.handleIntentsChange = this.handleIntentsChange.bind(this);
        this.handleAddIntent = this.handleAddIntent.bind(this);
        this.handleRemoveIntent = this.handleRemoveIntent.bind(this);

        this.handleSlotsChange = this.handleSlotsChange.bind(this);
        this.handleAddSlot = this.handleAddSlot.bind(this);
        this.handleRemoveSlot = this.handleRemoveSlot.bind(this);

        this.handleChoicesChange = this.handleChoicesChange.bind(this)
        this.handleAddChoice = this.handleAddChoice.bind(this)
        this.handleRemoveChoice = this.handleRemoveChoice.bind(this)

        this.showErrorPopup = this.showErrorPopup.bind(this)
    }

    _getIndex(index) {
        return converter.toWords(index).replace(/\s/g, '_').replace(/,/g,'').replace(/-/g,'_')
    }

    _findFirstEmptyIndex(array) {
        for (let i = 0; i < array.length; i++) {
            if (!array.includes(i)) return i
        }
        return array.length
    }

    handleIntentsChange(intents, intents_open) {  
        this.setState({
            intents: intents,
            intents_open: intents_open
        }, () => {this.props.onIntent(intents, intents_open)});
    }

    handleSlotsChange(slots, slots_open) {
        this.setState({
            slots: slots,
            slots_open: slots_open
        },  () => {this.props.onSlot(slots, slots_open)});
    }

    handleAddIntent(e) {
        const intents = this.state.intents;
        const intents_open = this.state.intents_open;

        let name = 'intent_' + this._getIndex(intents.length+1)

        const find = (name) => intents.find(e => e.name === name)
        while(find(name)) {
            name = 'new_' + name
        }

        const firstEmpty = this._findFirstEmptyIndex(intents.map(o => o.key))

        intents.push({name: name, inputs: [], key: firstEmpty, built_in: false});
        intents_open.push(true);

        this.setState({
            intents: intents,
            intents_open: intents_open,
        }, () => {this.props.onIntent(intents, intents_open)});
    }

    handleAddSlot(e) {
        const slots = this.state.slots;
        const slots_open = this.state.slots_open;

        let name = 'slot_' + this._getIndex(slots.length+1)

        const find = (name) => slots.find(e => e.name === name)
        while(find(name)) {
            name = 'new_' + name
        }

        const firstEmpty = this._findFirstEmptyIndex(slots.map(o => o.key))

        slots.push({name: name, inputs: [], type: '', key: firstEmpty})
        slots_open.push(true);

        this.setState({
            slots: slots,
            slots_open: slots_open,
        }, () => {this.props.onSlot(slots, slots_open)});
    }

    handleRemoveIntent(e, i) {
        const intents = this.state.intents;
        const intents_open = this.state.intents_open;
        const used_intents = new Set();
        const choice_names = {}

        this.state.node.extras.choices.forEach(choice => {
            if (choice.intent) {
                used_intents.add(choice.intent.value)
                choice_names[choice.intent.value] = choice.name
            }
        })

        if (used_intents.has(intents[i].key)) {
            const error = `Cannot remove intent as it is currently being used in a choice (${choice_names[intents[i].key]})!`
            this.setState({
                error: error
            })
        } else {
            intents.splice(i, 1);
            intents_open.splice(i, 1);
            this.setState({
                intents: intents,
                intents_open: intents_open,
             }, () => {this.props.onIntent(intents, intents_open)});
        }
    }

    handleRemoveSlot(e, i) {
        const slots = this.state.slots;
        const slots_open = this.state.slots_open;
        const used_slots = new Set();
        const slot_names = {}

        this.state.intents.forEach(intent => {
            const utterances = intent.inputs
            utterances.forEach( u => u.slots.forEach(s => {
                used_slots.add(s)
                slot_names[s] = intent.name
            }))
        })

        if (used_slots.has(slots[i].key)) {
            const error = `Cannot remove slot as it is currently being used in an intent (${slot_names[slots[i].key]})!`
            this.setState({
                error: error
            })
        } else {
            slots.splice(i, 1);
            slots_open.splice(i, 1);
            this.setState({
                slots: slots,
                slots_open: slots_open,
            }, () => {this.props.onSlot(slots, slots_open)});
        }
    }

    handleChoicesChange(choices, choices_open) {
        const node = this.state.node
        node.extras.choices = choices
        node.extras.choices_open = choices_open

        this.setState({
            node: node
        })
        this.props.onUpdate()
    }

    handleAddChoice(e) {
        const node = this.state.node;
        const choices = node.extras.choices;
        const choices_open = node.extras.choices_open

        const firstEmpty = this._findFirstEmptyIndex(choices.map(o => o.key))

        choices.push({intent: null, mappings: [], key: firstEmpty})
        choices_open.push(true);

        let test = node.addOutPort(node.extras.choices.length);
        test.setMaximumLinks(1);

        this.setState({
            node: node
        })
        this.props.onUpdate()
        this.props.repaint()
    }

    handleRemoveChoice(e, i) {
        const node = this.state.node;
        const choices = node.extras.choices;
        const choices_open = node.extras.choices_open;

        for (var name in node.getPorts()) {
            var port = node.getPort(name)

            if (port.label === node.extras.choices.length) {
                node.removePort(port)
                break
            }
        }

        choices.splice(i, 1);
        choices_open.splice(i, 1);

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
                        open = {this.state.node.extras.choices_open}
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
                        open = {this.state.intents_open}
                        onAdd={this.handleAddIntent}
                        onRemove={this.handleRemoveIntent}
                        onChange={this.handleIntentsChange}
                        slots = {this.state.slots}
                        onError={this.showErrorPopup}
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
                        open = {this.state.slots_open}
                        onAdd={this.handleAddSlot}
                        onRemove={this.handleRemoveSlot}
                        onChange={this.handleSlotsChange}
                        slot_types = {this.props.slot_types}
                        onError={this.showErrorPopup}
                    />
                </div>
            )
        }

        return (
            <div>
                <ErrorModal error={this.state.error} dismiss={()=>this.setState({error: null})}/>  
                <ButtonGroup className="toggle-group mb-2">
                    <Button outline={this.state.tab !== 'choices'} onClick={() => {this.setState({tab: 'choices'})}} disabled={this.state.tab === 'choices'}> Choices </Button>
                    <Button outline={this.state.tab !== 'intents'} onClick={() => {this.setState({tab: 'intents'})}} disabled={this.state.tab === 'intents'}> Intents </Button>
                    <Button outline={this.state.tab !== 'slots'} onClick={() => {this.setState({tab: 'slots'})}} disabled={this.state.tab === 'slots'}> Slots </Button>
                </ButtonGroup>
                {this.state.tab === 'choices' && renderChoices()}
                {this.state.tab === 'intents' && renderIntents()}
                {this.state.tab === 'slots' && renderSlots()}
            </div>
        );
    }
}

export default Interaction;
