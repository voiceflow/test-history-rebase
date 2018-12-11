import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import './SlotInputs.css'
import { Collapse } from 'reactstrap';
import Select from 'react-select'
import { Input } from 'reactstrap';

class SlotInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            slots: this.props.slots,
            text_entries: [],
            open: this.props.open,
            input_error: this.props.slots ? Array(this.props.slots.length).fill('') : [],
            name_inputs: this.props.slots.map(slot => slot.name),
            search_value: ""
        };
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onDeleteExample = this.onDeleteExample.bind(this);
        this.onNameSave = this.onNameSave.bind(this)
        this.onNameChange = this.onNameChange.bind(this)
        this.updateSlotType = this.updateSlotType.bind(this)
        this.onSearchChange = this.onSearchChange.bind(this)
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
            open: props.open,
            name_inputs: this.props.slots.map(slot => slot.name)
        });
    }

    handleKeyPress(e, i) {
        // Enter key pressed
        if(e.charCode==13){
            e.preventDefault();
            const slots = this.state.slots;
            const slot = slots[i];
            const text_entries = this.state.text_entries;
            const newValue = e.target.value;
            if (!Array.isArray(slot.inputs)) {
                slot.inputs = [];
            }
            if (newValue) {
                slot.inputs.push(newValue);
                text_entries[i] = '';
            }
            this.setState({
                slots: slots,
                text_entries: text_entries
            }, () => {this.props.onChange(slots, this.state.open)})
        }
    }

    onTextChange(value, i) {
        const text_entries = this.state.text_entries;
        text_entries[i] = value;
        this.setState({
            text_entries: text_entries
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
        const input = e.target.value.toLowerCase()
        const re = /^[_a-z]+$/g
        const input_error = this.state.input_error
        if (!re.test(input) && input.length > 0) {
            input_error[i] = 'Slot names can only contain lowercase letters and underscores!'
        } else {
            input_error[i] = ''
        }
        const name_inputs = this.state.name_inputs;
        name_inputs[i] = input
        this.setState({
            name_inputs: name_inputs,
            input_error: input_error
        })
    }

    onNameSave(e, i) {
        e.preventDefault()
        const slots = this.state.slots
        if (slots.map(i => i.name).filter((v, ind) => ind !== i).includes(e.target.value)) {
            this.props.onError('A slot already exists with this name!')
            this.setState({
                name_inputs: this.props.slots.map(slot => slot.name)
            })
        }  else if (this.state.input_error[i] !== ''){
            const input_error = this.state.input_error
            input_error[i] = ''
            this.props.onError('Slot names can only contain lowercase letters and underscores!')
            this.setState({
                name_inputs: this.props.slots.map(slot => slot.name),
                input_error: input_error
            })
        } else {
            const slots = this.state.slots
            slots[i].name = e.target.value
            this.setState({
                slots: slots
            })
            this.props.onChange(this.state.slots, this.state.open)
        }
    }

    updateSlotType(target, i) {
      const slots = this.state.slots;
      slots[i].type = target;
      this.setState({
        slots: slots
      }, () => {this.props.onChange(slots, this.state.open)})
    }

    onSearchChange(e) {
        this.setState({
            search_value: e.target.value.toLowerCase()
        })
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
            <div>
                <Input type="search" onChange={this.onSearchChange} id="searchSlots" placeholder="Search Slots" className="mb-3"></Input>
            </div>
                {Array.isArray(this.state.slots) ? this.state.slots.map((slot, i) => {
                    if (this.state.name_inputs[i].indexOf(this.state.search_value) >= 0) {
                        return (
                            <div className="interaction-block" key={i}>
                                <a>
                                    <div className="interaction-title">
                                        <span onClick={() => {this.toggleCollapse(i)}}>{this.state.open[i] ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>}   {i+1}</span>
                                        <input placeholder="Enter Slot Name" 
                                            type="text"
                                            value={this.state.name_inputs[i]}
                                            onChange={(e) => {this.onNameChange(e, i)}}
                                            onBlur={(e) => {this.onNameSave(e, i)}}
                                            onKeyPress={ (e) => {if(e.charCode==13){e.preventDefault()}}}
                                            className="interaction-name-input"
                                        />                                    
                                        <button className="close" onClick={e => this.props.onRemove(e, i)}>&times;</button>
                                    </div>
                                </a>
                                <div className="input-error">{this.state.input_error[i]}</div>
                                <Collapse isOpen={this.state.open[i]}>
                                {renderUtterances(this.state.slots[i].inputs, i)}
                                    <Textarea 
                                        className="input-area"
                                        name="inputs" 
                                        value={this.state.text_entries[i]} 
                                        onKeyPress={ (target) => {this.handleKeyPress(target, i)}}
                                        onChange={(e) => {this.onTextChange(e.target.value, i)}}
                                        placeholder="What would a user say to select this slot? (Press Enter after typing out each example)" 
                                    />
                                    <div className="super-center flex-hard choice-select">
                                    <div>Slot Type</div>
                                    <Select
                                        placeholder="Select Slot Type"
                                        className="input-select"
                                        value={slot.type}
                                        onChange={(e) => this.updateSlotType(e, i)}
                                        options={this.props.slot_types.map(type => {
                                            return {label: type, value: type}
                                        })}
                                    />
                                    </div>
                                </Collapse>
                            </div> )
                    } else {
                        return null
                    }
                }) : null }
                <div><button className="btn btn-default btn-block" onClick={this.props.onAdd}><i className="far fa-plus"></i> Add Slot</button></div>
            </div>
        );
    }
}

export default SlotInputs;
