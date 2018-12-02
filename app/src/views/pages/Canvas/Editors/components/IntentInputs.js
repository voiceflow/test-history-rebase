import React, { Component } from 'react'
import './IntentInputs.css'
import { Collapse } from 'reactstrap'

import { MentionsInput, Mention } from 'react-mentions'

const _ = require('lodash')

class IntentInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            intents: this.props.intents,
            text_entries: this.props.intents ? Array(this.props.intents.length).fill('') : [],
            open: this.props.open,
        };
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onDeleteUtterance = this.onDeleteUtterance.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onAddIntent = this.onAddIntent.bind(this);
        this.onRemoveIntent = this.onRemoveIntent.bind(this)
        this.onNameSave = this.onNameSave.bind(this)
    }

    _getSlotKeys(input) {
      const re = /\{\{\[[^\}\{\[\]]+]\.(\d+)\}\}/g;
      let m;
      const slot_keys = new Set()

      do {
          m = re.exec(input)
          if (m) {
            const key = m[1]
            slot_keys.add(+key)
          }
      } while (m);
      
      return slot_keys
    }

    toggleCollapse(i){
        const open = this.state.open;
        open[i] = !open[i]
        this.setState({
            open: open
        }, () => {this.props.onChange(this.state.intents, open)});
    }

    componentWillReceiveProps(props) {
        this.setState({
            intents: props.intents,
            open: props.open
        });
    }

    handleKeyPress(e, i) {
        // Enter key pressed
        if(e.charCode==13){
            e.preventDefault();
            const intents = this.state.intents
            const intent = intents[i];
            const text_entries = this.state.text_entries;
            const newValue = text_entries[i]
            const slot_keys= this._getSlotKeys(newValue)

            const utterance = {
              slots: Array.from(slot_keys),
              text: newValue
            }

            if (!Array.isArray(intent.inputs)) {
                intent.inputs = [];
            }
            if (newValue) {
                intent.inputs.push(utterance);
                text_entries[i] = '';
            }
            this.setState({
                intents: intents,
                text_entries: text_entries
            }, () => {this.props.onChange(intents, this.state.open)})
        }
    }

    onTextChange(value, i) {
        const text_entries = this.state.text_entries;
        text_entries[i] = value;
        this.setState({
            text_entries: text_entries
        })
    }

    onDeleteUtterance(e, i, intent_i) {
        const intents = this.state.intents
        const inputs = intents[intent_i].inputs;
        inputs.splice(i, 1);
        this.setState({
            intents: intents
        }, () => {this.props.onChange(this.state.intents, this.state.open)})
    }

    onNameChange(e, i) {
        e.preventDefault()
        const intents = this.state.intents;
        intents[i].name = e.target.value
        this.setState({
            intents: intents
        })
    }

    onNameSave(e) {
        e.preventDefault()
        this.props.onChange(this.state.intents, this.state.open)
    }

    onAddIntent(e) {
        const text_entries = this.state.text_entries
        text_entries.push('')

        this.setState({
            text_entries: text_entries
        }, () => {this.props.onAdd(e)})
    }

    onRemoveIntent(e, i) {
        const text_entries = this.state.text_entries
        text_entries.splice(i, 1)
        this.props.onRemove(e, i)
    }

    _getUtterancesWithSlotNames(utterances, slots) {

        const re = /(\{\{\[[^\}\{\[\]]+]\.(\d+)\}\})/g;
        let m;

        const utterance_text = utterances.map(e => e.text)

        const new_utterances = utterance_text.map( input => {
            let new_input = input
            do {
                m = re.exec(input)
                if (m) {
                    const replace = m[1]
                    const key = m[2]
                    const slot =_.find(slots, { key: +key })
                    if (slot) {
                        const slot_name = _.find(slots, { key: +key }).name
                        new_input = new_input.replace(replace, `[${slot_name}]`)
                    } else {
                        return new_input
                    }
                }
            } while (m);
            return new_input
        })
        return new_utterances
    }

    render() {

        const renderUtterances = (utterances, intent_i) => {
            if (Array.isArray(utterances)) {
                utterances = this._getUtterancesWithSlotNames(utterances, this.props.slots)
                return utterances.map( (u, i) => {
                    return <div className="interaction-utterance" key={i}><div>{u}</div><a><i onClick={(e) => {this.onDeleteUtterance(e, i, intent_i)}} className="fas fa-backspace trash-icon"></i></a></div>
                });
            }
            return null
        }

        return (
            <div className="w-100">
                {Array.isArray(this.state.intents) ? this.state.intents.map((intent, i) => {
                    return (
                        <div className="interaction-block" key={i}>
                            <a>
                                <div className="interaction-title">
                                    <span onClick={() => {this.toggleCollapse(i)}}>{this.state.open[i] ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>}   {i+1}</span>
                                    <input placeholder="Enter Intent Name" 
                                        type="text"
                                        value={intent.name}
                                        onChange={(e) => {this.onNameChange(e, i)}}
                                        onBlur={(e) => {this.onNameSave(e)}}
                                        onKeyPress={ (e) => {if(e.charCode==13){e.preventDefault()}}}
                                        className="interaction-name-input"
                                    />
                                    <button className="close" onClick={e => this.props.onRemove(e, i)}>&times;</button>
                                </div>
                            </a>
                            <Collapse isOpen={this.state.open[i]}>
                            {renderUtterances(intent.inputs, i)}
                            <MentionsInput className="input-area" 
                                markup='{{[__display__].__id__}}'
                                displayTransform={(id, display) => { return '[' + display + ']'}}
                                value={this.state.text_entries[i]}
                                onChange={(e) => {this.onTextChange(e.target.value, i)}}
                                onKeyPress={(e) => {this.handleKeyPress(e, i)}}
                                placeholder="What would a user say to select this intent? (Press Enter after typing out each example)" 
                                allowSpaceInQuery={true}>
                                <Mention
                                    trigger="["
                                    data={this.props.slots.map((slot) => {return {display: slot.name, id: slot.key.toString()}})}
                                 />
                            </MentionsInput>
                            </Collapse>
                        </div> )
                }) : null}
                <div><button className="btn btn-default btn-block" onClick={this.onAddIntent}><i className="far fa-plus"></i> Add Intent</button></div>
            </div>
        );
    }
}

export default IntentInputs;


// data={() => {return this.props.slots.map((slot, i) => {return {display: "hello", id: i }})}}
