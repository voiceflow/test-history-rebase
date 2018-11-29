import React, { Component } from 'react';
import IntentInputs from './components/IntentInputs';
import SlotInputs from './components/SlotInputs'
import { Button, ButtonGroup } from 'reactstrap';
import ChoiceDropdownInputs from './components/ChoiceDropdownInputs'

class Interaction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            intents: this.props.intents,
            slots: this.props.slots,
            intents_open: this.props.intents_open,
            slots_open: this.props.slots_open,
            node: this.props.node,
            tab: 'choices',
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
        // console.log(this.state.intents);
        const intents = this.state.intents;
        const intents_open = this.state.intents_open;

        let num = 1
        while(intents.map(e => {return e.name}).includes(`New Intent ${num}`)) {
            num += 1;
        }

        const firstEmpty = this._findFirstEmptyIndex(intents.map(o => o.key))

        intents.push({name: `New Intent ${num}`, inputs: [], key: firstEmpty});
        intents_open.push(true);

        this.setState({
            intents: intents,
            intents_open: intents_open,
        }, () => {this.props.onIntent(intents, intents_open)});
        e.preventDefault();
    }

    handleAddSlot(e) {
        const slots = this.state.slots;
        const slots_open = this.state.slots_open;

        let num = 1
        while(slots.map(e => {return e.name}).includes(`New Slot ${num}`)) {
            num += 1;
        }

        const firstEmpty = this._findFirstEmptyIndex(slots.map(o => o.key))

        slots.push({name: `New Slot ${num}`, inputs: [], type: '', key: firstEmpty})
        slots_open.push(true);

        this.setState({
            slots: slots,
            slots_open: slots_open,
        }, () => {this.props.onSlot(slots, slots_open)});
        e.preventDefault();
    }

    handleRemoveIntent(e, i) {
        const intents = this.state.intents;
        const intents_open = this.state.intents_open;
        intents.splice(i, 1);
        intents_open.splice(i, 1);
        this.setState({
            intents: intents,
            intents_open: intents_open,
         }, () => {this.props.onIntent(intents, intents_open)});
        e.preventDefault();
    }

    handleRemoveSlot(e, i) {
        const slots = this.state.slots;
        const slots_open = this.state.slots_open;

        slots.splice(i, 1);
        slots_open.splice(i, 1);
        this.setState({
            slots: slots,
            slots_open: slots_open,
        }, () => {this.props.onSlot(slots, slots_open)});
        e.preventDefault();
    }

    handleChoicesChange(choices, choices_open) {  
        this.setState({
            choices: choices,
            choices_open: choices_open
        });
    }

    handleAddChoice(e) {
        const node = this.state.node;
        const choices = node.extras.choices;
        const choices_open = node.extras.choices_open;

        let num = 1
        while(choices.map(e => {return e.name}).includes(`New Choice ${num}`)) {
            num += 1;
        }

        const firstEmpty = this._findFirstEmptyIndex(choices.map(o => o.key))

        choices.push({name: `New Choice ${num}`, intent: null, mapping: [], key: firstEmpty})
        choices_open.push(true);

        this.setState({
            choices: choices,
            choices_open: choices_open,
        });
        e.preventDefault();
    }

    handleRemoveChoice(e, i) {
        const node = this.state.node;
        const choices = node.extras.choices;
        const choices_open = node.extras.choices_open;

        choices.splice(i, 1);
        choices_open.splice(i, 1);
        this.setState({
            node: node,
        });
        e.preventDefault();
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
                    />
                </div>
            )
        }

        return (
            <div>
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
