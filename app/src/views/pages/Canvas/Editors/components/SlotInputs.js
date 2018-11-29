import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import './SlotInputs.css'
import { Collapse } from 'reactstrap';

class SlotInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            slots: this.props.slots,
            textEntries: {},
            open: this.props.open
        };
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onDeleteExample = this.onDeleteExample.bind(this);
    }

    toggleCollapse(i){
        const open = this.state.open;
        open[i] = !open[i]
        this.setState({
            open: open
        }, () => {this.props.onChange(this.state.slots, open)});
    }

    componentWillReceiveProps(props) {
        this.setState({
            slots: props.slots,
            open: props.open
        });
    }

    handleKeyPress(e, i) {
        // Enter key pressed
        if(e.charCode==13){
            e.preventDefault();
            const slots = this.state.slots;
            const slot = slots[i];
            const textEntries = this.state.textEntries;
            const newValue = e.target.value;
            if (!Array.isArray(slot.inputs)) {
                slot.inputs = [];
            }
            if (newValue) {
                slot.inputs.push(newValue);
                textEntries[i] = '';
            }
            this.setState({
                slots: slots,
                textEntries: textEntries
            }, () => {this.props.onChange(slots, this.state.open)})
        }
    }

    onTextChange(value, i) {
        const textEntries = this.state.textEntries;
        textEntries[i] = value;
        this.setState({
            textEntries: textEntries
        })
    }

    onDeleteExample(e, i, slot_i) {
        const slots = this.state.slots;
        slots[slot_i].inputs.splice(i, 1);
        this.setState({
            slots: slots
        }, () => {this.props.onChange(slots, this.state.open)})
    }

    onNameChange(e, i) {
        e.preventDefault()
        const slots = this.state.slots;
        slots[i].name = e.target.value
        this.setState({
            slots: slots
        }, () => {this.props.onChange(slots, this.state.open)})
    }

    render() {

        const renderUtterances = (utterances, slot_i) => {
            if (Array.isArray(utterances)) {
                return utterances.map( (u, i) => {
                    return <div className="interaction-utterance" key={i}><div>{u}</div><a><i onClick={(e) => {this.onDeleteExample(e, i, slot_i)}} className="fas fa-backspace trash-icon"></i></a></div>
                });
            }
            return null
        }

        return (
            <div className="w-100">
                {Array.isArray(this.state.slots) ? this.state.slots.map((slot, i) => {
                    return (
                        <div className="interaction-block" key={i}>
                            <a>
                                <div className="interaction-title">
                                    <span onClick={() => {this.toggleCollapse(i)}}>{this.state.open[i] ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>}   {i+1}</span>
                                    <input placeholder="Enter Slot Name" 
                                        type="text"
                                        value={slot.name}
                                        onChange={(e) => {this.onNameChange(e, i)}}
                                        onKeyPress={ (e) => {if(e.charCode==13){e.preventDefault()}}}
                                        className="interaction-name-input"
                                    />                                    
                                    <button className="close" onClick={e => this.props.onRemove(e, i)}>&times;</button>
                                </div>
                            </a>
                            <Collapse isOpen={this.state.open[i]}>
                            {renderUtterances(this.state.slots[i].inputs, i)}
                                <Textarea 
                                    className="input-area"
                                    name="inputs" 
                                    value={this.state.textEntries[i]} 
                                    onKeyPress={ (target) => {this.handleKeyPress(target, i)}}
                                    onChange={(e) => {this.onTextChange(e.target.value, i)}}
                                    placeholder="What would a user say to select this slot? (Press Enter after typing out each example)" 
                                />
                            </Collapse>
                        </div> )
                }) : null}
                <div><button className="btn btn-default btn-block" onClick={this.props.onAdd}><i className="far fa-plus"></i> Add Slot</button></div>
            </div>
        );
    }
}

export default SlotInputs;
