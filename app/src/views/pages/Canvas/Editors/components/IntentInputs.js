import React, { Component } from 'react'
import { Input } from 'reactstrap'
import IntentInput from './IntentInput'
import './IntentInputs.css'

class IntentInputs extends Component {
    constructor(props) {
        super(props)

        this.state = {
            search_value: ""
        }

        this.onSearchChange = this.onSearchChange.bind(this)
        this.checkUtterances = this.checkUtterances.bind(this)
        this.checkName = this.checkName.bind(this)
        this.onAdd = this.onAdd.bind(this)
    }

    onAdd(e){
        e.preventDefault()
        this.setState({
            search_value: ''
        })
        this.props.onAdd()
    }

    _getSlotKeys(input) {
      const re = /\{\{\[[^}{[\]]+]\.([a-zA-Z0-9]+)\}\}/g;
      let m;
      const slot_keys = new Set()

      do {
          m = re.exec(input)
          if (m) {
            const key = m[1]
            slot_keys.add(key)
          }
      } while (m);
      
      return slot_keys
    }

    checkUtterances(utterance){
        const all_utterances = []
        this.props.intents.forEach(intent => {
            intent.inputs.forEach(input => {
                all_utterances.push(input.text.toLowerCase())
            })
        })

        return all_utterances.includes(utterance.toLowerCase())
    }

    checkName(name) {
        return this.props.intents.findIndex(i => i.name === name) !== -1
    }

    onSearchChange(e) {
        this.setState({
            search_value: e.target.value.toLowerCase()
        })
    }

    render() {
        return (
            <div className="w-100">
            <div>
                <Input type="search" onChange={this.onSearchChange} id="searchIntents" className="form-control-border mb-3 search-input" placeholder="Search Intents" value={this.state.search_value}></Input>
            </div>
                {Array.isArray(this.props.intents) ? this.props.intents.map((intent, i) => {
                    if (intent.name.indexOf(this.state.search_value) !== -1) {
                        return <IntentInput 
                            key={intent.name}
                            slots={this.props.slots}
                            intent={intent}
                            onError={this.props.onError}
                            utteranceExists={this.checkUtterances}
                            nameExists={this.checkName}
                            removeIntent={(e) => this.props.onRemove(e, i)}
                            update={this.props.update}
                        />
                    }else{
                        return null
                    }
                }) : null}
                <div>
                    <button className="btn btn-clear btn-lg btn-block mt-3" onClick={this.onAdd}><i className="far fa-plus"></i> Add Intent</button>
                </div>
            </div>
        );
    }
}

export default IntentInputs
