import React, { Component } from 'react';
import IntentInputs from './components/IntentInputs';
import SlotInputs from './components/SlotInputs'

class Interaction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            intents: this.props.intents,
            slots: this.props.slots,
            intents_open: this.props.intents_open,
            slots_open: this.props.slots_open,
            node: this.props.node
        };
        
        this.handleIntentsChange = this.handleIntentsChange.bind(this);
        this.handleAddIntent = this.handleAddIntent.bind(this);
        this.handleRemoveIntent = this.handleRemoveIntent.bind(this);

        this.handleSlotsChange = this.handleSlotsChange.bind(this);
        this.handleAddSlot = this.handleAddSlot.bind(this);
        this.handleRemoveSlot = this.handleRemoveSlot.bind(this);
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

    render() {
        return (
            <div>
                <label>
                    Choices
                </label>
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
        );
    }
}

export default Interaction;
