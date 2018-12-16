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

        let reverse
        if(Array.isArray(this.props.intents)){
            reverse = []
            var i
            for(i=this.props.intents.length-1; i >= 0 ; i--){
                let intent = this.props.intents[i]

                if (intent.name.indexOf(this.state.search_value) !== -1) {
                    reverse.push(<IntentInput 
                        key={intent.key}
                        slots={this.props.slots}
                        intent={intent}
                        onError={this.props.onError}
                        utteranceExists={this.checkUtterances}
                        nameExists={this.checkName}
                        removeIntent={this.props.onRemove}
                        update={this.props.update}
                    />)
                }
            }
        }

        return (
            <div className="w-100">
            <div>
                <Input type="search" onChange={this.onSearchChange} id="searchIntents" className="form-control-border mb-3 search-input" placeholder="Search Intents" value={this.state.search_value}></Input>
            </div>
                <div>
                    <button className="btn btn-clear btn-lg btn-block mb-3" onClick={this.onAdd}><i className="far fa-plus"></i> Add Intent</button>
                </div>
                {reverse}
            </div>
        );
    }
}

export default IntentInputs
