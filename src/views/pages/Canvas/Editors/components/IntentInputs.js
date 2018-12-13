import React, { Component } from 'react'
import './IntentInputs.css'
import { Collapse } from 'reactstrap'
import { MentionsInput, Mention } from 'react-mentions'
import { Input } from 'reactstrap';

const _ = require('lodash')

class IntentInputs extends Component {
    constructor(props) {
        super(props)

        this.state = {
            intents: this.props.intents,
            text_entries: this.props.intents ? Array(this.props.intents.length).fill('') : [],
            open: this.props.open,
            input_error: this.props.intents ? Array(this.props.intents.length).fill('') : [],
            name_inputs: this.props.intents.map(intent => intent.name),
            search_value: ""
        }
        this.toggleCollapse = this.toggleCollapse.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.onTextChange = this.onTextChange.bind(this)
        this.onDeleteUtterance = this.onDeleteUtterance.bind(this)
        this.onNameChange = this.onNameChange.bind(this)
        this.onAddIntent = this.onAddIntent.bind(this)
        this.onRemoveIntent = this.onRemoveIntent.bind(this)
        this.onNameSave = this.onNameSave.bind(this)
        this.onSearchChange = this.onSearchChange.bind(this)
        this.submitEntry = this.submitEntry.bind(this)
    }

    _getSlotKeys(input) {
      const re = /\{\{\[[^}{[\]]+]\.(\d+)\}\}/g;
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
            open: props.open,
            name_inputs: this.props.intents.map(intent => intent.name)
        });
    }

    handleKeyPress(e, i) {
        // Enter key pressed
        // Add utterance
        if(e.charCode===13){
            e.preventDefault()
            this.submitEntry(i)
        }
    }

    submitEntry(i){
        const all_utterances = []
        const intents = this.state.intents

        intents.forEach(intent => {
            intent.inputs.forEach(input => {
                all_utterances.push(input.text.toLowerCase())
            })
        })

        const intent = intents[i]
        const text_entries = this.state.text_entries
        const newValue = text_entries[i].trim()
        const slot_keys= this._getSlotKeys(newValue)

        if (all_utterances.includes(newValue.toLowerCase())) {
            this.props.onError('Duplicate utterances are not allowed!')
            text_entries[i] = '';
            this.setState({
                text_entries: text_entries
            })
        } else {
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
        const input = e.target.value.toLowerCase()
        const re = /^[_a-z]+$/g
        const input_error = this.state.input_error
        if (!re.test(input) && input.length > 0) {
            input_error[i] = 'Intent names can only contain lowercase letters and underscores!'
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
        const intents = this.state.intents
        if (intents.map(i => i.name).filter((v, ind) => ind !== i).includes(e.target.value)) {
            this.props.onError('An intent already exists with this name!')
            this.setState({
                name_inputs: this.props.intents.map(intent => intent.name)
            })
        } else if (this.state.input_error[i] !== ''){
            const input_error = this.state.input_error
            input_error[i] = ''
            this.props.onError('Intent names can only contain lowercase letters and underscores!')
            this.setState({
                name_inputs: this.props.intents.map(intent => intent.name),
                input_error: input_error
            })
        } else {
            const intents = this.state.intents
            intents[i].name = e.target.value
            this.setState({
                intents: intents
            })
            this.props.onChange(this.state.intents, this.state.open)
        }
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

    onSearchChange(e) {
        this.setState({
            search_value: e.target.value.toLowerCase()
        })
    }

    _getUtterancesWithSlotNames(utterances, slots) {

        const re = /(\{\{\[[^}{[\]]+]\.(\d+)\}\})/g;
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
                    return <div className="interaction-utterance" key={i}><div>{u}</div><i onClick={(e) => {this.onDeleteUtterance(e, i, intent_i)}} className="fas fa-backspace trash-icon"></i></div>
                });
            }
            return null
        }

        return (
            <div className="w-100">
            <div>
                <Input type="search" onChange={this.onSearchChange} id="searchIntents" className="form-control-border mb-3" placeholder="Search Intents"></Input>
            </div>
                {Array.isArray(this.state.intents) ? this.state.intents.map((intent, i) => {
                    if (this.state.name_inputs[i].indexOf(this.state.search_value) >= 0) {
                        return (
                            <div className="interaction-block" key={i}>
                                <div className="intent-title">
                                    <span onClick={() => {this.toggleCollapse(i)}}><i className={"fas fa-caret-right rotate" + (this.state.open[i] ? " fa-rotate-90" : "")}></i></span>
                                    <input placeholder="Enter Intent Name" 
                                        type="text"
                                        value={this.state.name_inputs[i]}
                                        onChange={(e) => {this.onNameChange(e, i)}}
                                        onBlur={(e) => {this.onNameSave(e, i)}}
                                        onKeyPress={ (e) => {if(e.charCode===13){e.preventDefault()}}}
                                        className="interaction-name-input"
                                    />
                                    <button className="close" onClick={e => this.props.onRemove(e, i)}>&times;</button>
                                </div>
                                <div className="input-error">{this.state.input_error[i]}</div>
                                    <Collapse isOpen={this.state.open[i]}>
                                    <div>
                                        {renderUtterances(intent.inputs, i)}
                                    </div>
                                    <MentionsInput 
                                        className="mentions-input" 
                                        markup='{{[__display__].__id__}}'
                                        displayTransform={(id, display) => { return '[' + display + ']'}}
                                        value={this.state.text_entries[i]}
                                        onChange={(e) => {this.onTextChange(e.target.value, i)}}
                                        onKeyPress={(e) => {this.handleKeyPress(e, i)}}
                                        placeholder="Enter user reply" 
                                        allowSpaceInQuery={true}>
                                        <Mention
                                            trigger="["
                                            data={this.props.slots.map((slot) => {return {display: slot.name, id: slot.key.toString()}})}
                                            style={{backgroundColor: '#DCEEFF', outline: '1px solid #DCEEFF'}}
                                        />
                                    </MentionsInput>
                                    <div className="text-center mt-2">
                                        <span className="key-bubble forward pointer" onClick={() => this.submitEntry(i)}><i className="far fa-long-arrow-right"/></span>
                                    </div>
                                </Collapse>
                            </div> )
                    } else {
                        return null
                    }
                }) : null}
                <div><button className="btn btn-clear btn-lg btn-block mt-3" onClick={this.onAddIntent}><i className="far fa-plus"></i> Add Intent</button></div>
            </div>
        );
    }
}

export default IntentInputs;


// data={() => {return this.props.slots.map((slot, i) => {return {display: "hello", id: i }})}}
