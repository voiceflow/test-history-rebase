import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import './SlotInputs.css'
import { Collapse } from 'reactstrap';
import Select from 'react-select'

class SlotInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            slots: this.props.slots,
            text_entries: [],
            open: this.props.open
        };
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onDeleteExample = this.onDeleteExample.bind(this);
        this.onNameSave = this.onNameSave.bind(this)
        this.onNameChange = this.onNameChange.bind(this)
        this.updateSlotType = this.updateSlotType.bind(this)
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
        const slots = this.state.slots;
        slots[i].name = e.target.value
        this.setState({
            slots: slots
        })
    }

    onNameSave(e) {
        e.preventDefault()
        this.props.onChange(this.state.slots, this.state.open)
    }

    updateSlotType(target, i) {
      const slots = this.state.slots;
      slots[i].type = target;
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
                                        onBlur={(e) => {this.onNameSave(e)}}
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
                                          return {label: type.name, value: type.name}
                                      })}
                                  />
                                </div>
                            </Collapse>
                        </div> )
                }) : null}
                <div><button className="btn btn-default btn-block" onClick={this.props.onAdd}><i className="far fa-plus"></i> Add Slot</button></div>
            </div>
        );
    }
}

export default SlotInputs;
