import React, { Component } from 'react';
import InteractionInputs from './components/InteractionInputs';
import SlotMappings from './components/SlotMappings'

class Interaction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            node: this.props.node,
            voices: Array.isArray(this.props.voices) ? this.props.voices : []
        };
        
        this.handleInputsChange = this.handleInputsChange.bind(this);
        this.handleAddChoice = this.handleAddChoice.bind(this);
        this.handleRemoveChoice = this.handleRemoveChoice.bind(this);

        this.handleSlotsChange = this.handleSlotsChange.bind(this);
        this.handleAddSlot = this.handleAddSlot.bind(this);
        this.handleRemoveSlot = this.handleRemoveSlot.bind(this);
    }

    handleInputsChange(new_inputs, i) {
        var node = this.state.node;

        node.extras.inputs[i] = new_inputs;        
        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleSlotsChange(new_slot, i) {
        var node = this.state.node;

        node.extras.slots[i] = new_slot;        
        this.setState({
            node: node
        }, this.props.onUpdate);
    }

    handleAddChoice(e) {
        // console.log(this.state.node.extras.choices);
        var node = this.state.node;
        node.extras.choices.push('New Choice');
        node.extras.inputs.push('');
        node.extras.inputs_open.push(true);
        let test = node.addOutPort(node.extras.choices.length);
        test.setMaximumLinks(1);

        this.setState({
            node: node
        }, this.props.onUpdate);
        this.props.repaint();
        e.preventDefault();
    }

    handleAddSlot(e) {
        var node = this.state.node;
        node.extras.slots.push({ name : 'New Slot', inputs: [], type: ''});
        node.extras.slots_open.push(true);

        this.setState({
            node: node
        }, this.props.onUpdate);
        this.props.repaint();
        e.preventDefault();
    }

    handleRemoveChoice(e, i) {
        var node = this.state.node;
        for (var name in node.getPorts()) {
            var port = node.getPort(name);

            if (port.label === node.extras.choices.length) {
                node.removePort(port);
                break;
            }
        }
        node.extras.choices.splice(i, 1);
        node.extras.inputs.splice(i, 1);
        node.extras.inputs_open.splice(i, 1);
        this.setState({
            node: node
        }, this.props.onUpdate);
        this.props.repaint();
        e.preventDefault();
    }


    handleRemoveSlot(e, i) {
        var node = this.state.node;
        node.extras.slots.splice(i, 1);
        node.extras.slots_open.splice(i, 1);
        this.setState({
            node: node
        }, this.props.onUpdate);
        this.props.repaint();
        e.preventDefault();
    }

    render() {
        return (
            <div>
                <label>
                    Choices
                </label>
                <InteractionInputs
                    choices={this.state.node.extras.choices}
                    inputs={this.state.node.extras.inputs}
                    open = {this.state.node.extras.inputs_open}
                    onAdd={this.handleAddChoice}
                    onRemove={this.handleRemoveChoice}
                    onChange={this.handleInputsChange}
                />
                <label>
                    Slots
                </label>
                <SlotMappings
                    slots = {this.state.node.extras.slots}
                    open = {this.state.node.extras.slots_open}
                    onAdd={this.handleAddSlot}
                    onRemove={this.handleRemoveSlot}
                    onChange={this.handleSlotsChange}
                />
            </div>
        );
    }
}

export default Interaction;
