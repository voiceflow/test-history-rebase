import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import './SlotInputs.css'
import { Collapse } from 'reactstrap';
import Select from 'react-select'
import { Input } from 'reactstrap';
import {Tooltip} from 'react-tippy'

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
        this.submitEntry = this.submitEntry.bind(this)
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
        if(e.charCode===13){
            e.preventDefault();
            this.submitEntry(i)
        }
    }

    submitEntry(i){
        const slots = this.state.slots;
        const slot = slots[i];
        const text_entries = this.state.text_entries;
        const newValue = text_entries[i];
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
        const input = e.target.value.toLowerCase().replace(/\s/g, '_')
        const input_error = this.state.input_error
        const re = /^[_a-z]+$/g
        if (!re.test(input) && input.length > 0) {
            console.log("DSDSD")
            input_error[i] = 'Slot names can only contain lowercase letters and underscores!'
        } else {
            console.log("WTF")
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
        } else if(!e.target.value.trim()) {
            this.setState({
                name_inputs: this.props.slots.map(slot => slot.name)
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
                    return <div className="interaction-utterance" key={i}><div>{u}</div><i onClick={(e) => {this.onDeleteExample(e, i, slot_i)}} className="fas fa-backspace trash-icon"></i></div>
                });
            }
            return null
        }
        
        return (
            <div className="w-100">
            <div>
                <Input type="search" onChange={this.onSearchChange} id="searchSlots" placeholder="Search Slots" className="mb-3 form-control-border search-input"></Input>
            </div>
                {Array.isArray(this.state.slots) ? this.state.slots.map((slot, i) => {
                    if (this.state.name_inputs[i].indexOf(this.state.search_value) >= 0) {
                        return (
                            <div className="interaction-block mb-2" key={i}>
                                <div className="intent-title">
                                    <span onClick={() => {this.toggleCollapse(i)}}><i className={"fas fa-caret-right rotate" + (this.state.open[i] ? " fa-rotate-90" : "")}></i></span>
                                    <Tooltip
                                        className="flex-hard"
                                        theme="warning"
                                        arrow={true}
                                        position="bottom-start"
                                        open={!!(this.state.input_error[i])}
                                        distance={5}
                                        html={this.state.input_error[i]}
                                    >
                                        <input placeholder="Enter Slot Name" 
                                            type="text"
                                            value={this.state.name_inputs[i]}
                                            onChange={(e) => {this.onNameChange(e, i)}}
                                            onBlur={(e) => {this.onNameSave(e, i)}}
                                            onKeyPress={ (e) => {if(e.charCode===13){e.preventDefault()}}}
                                            className="interaction-name-input"
                                        />
                                    </Tooltip>                                
                                    <button className="close" onClick={e => this.props.onRemove(e, i)}>&times;</button>
                                </div>
                                <Collapse isOpen={this.state.open[i]}>
                                    <div className="super-center flex-hard choice-select">
                                        <Select
                                            placeholder="Select Slot Type"
                                            classNamePrefix="select-box"
                                            className='select-box mb-2'
                                            value={slot.type}
                                            onChange={(e) => this.updateSlotType(e, i)}
                                            options={this.props.slot_types.map(type => {
                                                return {label: type, value: type}
                                            })}
                                        />
                                    </div>
                                    <hr className="mt-1 mb-2"/>
                                    <div>
                                        {renderUtterances(this.state.slots[i].inputs, i)}
                                    </div>
                                    <Textarea 
                                        className="slot-input"
                                        name="inputs"
                                        value={this.state.text_entries[i]} 
                                        onKeyPress={ (target) => {this.handleKeyPress(target, i)}}
                                        onChange={(e) => {this.onTextChange(e.target.value, i)}}
                                        placeholder="Enter Slot Content Example" 
                                    />
                                    <div className="text-center mt-2">
                                        <span className="key-bubble forward pointer" onClick={() => this.submitEntry(i)}><i className="far fa-long-arrow-right"/></span>
                                    </div>
                                </Collapse>
                            </div> )
                    } else {
                        return null
                    }
                }) : null }
                <div><button className="btn btn-lg btn-clear btn-block mt-3" onClick={this.props.onAdd}><i className="far fa-plus"></i> Add Slot</button></div>
            </div>
        );
    }
}

export default SlotInputs;
