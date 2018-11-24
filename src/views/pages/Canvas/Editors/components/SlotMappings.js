import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
// import './SlotMappings.css'
import { Collapse } from 'reactstrap';

class SlotMappings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            slots: this.props.slots,
            textEntries: [],
            open: this.props.open
        };
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onDeleteUtterance = this.onDeleteUtterance.bind(this);
    }

    toggleCollapse(i){
        const open = this.state.open;
        open[i] = !open[i]
        this.setState({
            open: open
        });
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
            const textEntries = this.state.textEntries;
            const newValue = e.target.value;
            if (!Array.isArray(slots[i].inputs)) {
                slots[i].inputs = [];
            }
            if (newValue) {
                slots[i].inputs.push(newValue);
                textEntries[i] = '';
            }
            this.setState({
                slots: slots,
                textEntries: textEntries
            })
        }
    }

    onTextChange(value, i) {
        const textEntries = this.state.textEntries;
        textEntries[i] = value;
        this.setState({
            textEntries: textEntries
        })
    }

    onDeleteUtterance(e, i, slot_i) {
        const slots = this.state.slots;
        slots[slot_i].inputs.splice(i, 1);
        this.setState({
            slots: slots
        })
    }

    render() {

        const renderUtterances = (utterances, slot_i) => {
            if (Array.isArray(utterances)) {
                return utterances.map( (u, i) => {
                    return <div className="interaction-utterance" key={i}><div>{u}</div><a><i onClick={(e) => {this.onDeleteUtterance(e, i, slot_i)}} className="fas fa-backspace trash-icon"></i></a></div>
                });
            }
            return null
        }

        return (
            <div className="w-100">
                {Array.isArray(this.state.slots) ? this.state.slots.map((slot, i) => {
                    return (
                        <div className="interaction-block" key={i}>
                            <a onClick={() => {this.toggleCollapse(i)}}>
                                <div className="interaction-title">
                                    <span>{this.state.open[i] ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>}   {i+1}</span><div>Slot {i+1}</div>
                                    <button className="close" onClick={e => this.props.onRemove(e, i)}>&times;</button>
                                </div>
                            </a>
                            <Collapse isOpen={this.state.open[i]}>
                            {console.log("Asdfasdf", this.state.open[0])}
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

export default SlotMappings;
