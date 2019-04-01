import React, { Component } from 'react'
import { Input, Alert } from 'reactstrap'
import { connect } from 'react-redux'
import IntentInput from './IntentInput'
import './IntentInputs.css'
import randomstring from 'randomstring'
import converter from 'number-to-words'
import { setConfirm } from 'actions/modalActions'
const _getIndex = (index) => {
    return converter.toWords(index).replace(/\s/g, '_').replace(/,/g,'').replace(/-/g,'_')
}

class IntentInputs extends Component {
    constructor(props) {
        super(props)

        this.state = {
            search_value: ""
        }

        this.onSearchChange = this.onSearchChange.bind(this)
        this.checkUtterances = this.checkUtterances.bind(this)
        this.checkName = this.checkName.bind(this)

        this.handleAddIntent = this.handleAddIntent.bind(this)
        this.handleRemoveIntent = this.handleRemoveIntent.bind(this)
    }

    handleAddIntent() {
        let name = 'intent_' + _getIndex(this.props.intents.length+1)

        const find = (name) => this.props.intents.find(e => e.name === name)
        while(find(name)) {
            name = 'new_' + name
        }

        this.props.intents.push({name: name, inputs: [], key: randomstring.generate(12), open: true});

        this.props.update()
        this.setState({
            search: '',
        });
    }

    handleRemoveIntent(key) {
        this.props.setConfirm({
            text: <Alert color="warning" className="mb-0">Make sure this Intent isn't used in any Command or Intent blocks<br/>-<br/>Deleting may cause unexpected behavior</Alert>,
            confirm: () => {
                let i = this.props.intents.findIndex(i => i.key === key)
                if(i !== -1){
                    this.props.intents.splice(i, 1)
                    this.props.setCanFulfill(key, false)
                    this.props.update()
                    this.forceUpdate()
                }
            }
        })
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
        let length = 0
        let reverse
        if(Array.isArray(this.props.intents)){
            length = this.props.intents.length
            reverse = []
            var i
            for(i=length-1; i >= 0 ; i--){
                let intent = this.props.intents[i]

                if (intent.name.indexOf(this.state.search_value) !== -1) {
                    reverse.push(<IntentInput
                        key={intent.key}
                        slots={this.props.slots}
                        intent={intent}
                        utteranceExists={this.checkUtterances}
                        nameExists={this.checkName}
                        removeIntent={this.handleRemoveIntent}
                        update={this.props.update}
                        platform={this.props.platform}
                        live_mode={this.props.live_mode}
                    />)
                }
            }
        }
        
        return (
            <div className="w-100">
                {length > 4 && <Input type="search" onChange={this.onSearchChange} id="searchIntents" className="form-control-border mb-3 search-input" placeholder="Search Intents" value={this.state.search_value}></Input>}
                {length < 251 && <button className="btn btn-clear btn-lg btn-block mb-3" onClick={this.handleAddIntent} disabled={this.props.live_mode}><i className="far fa-plus"></i> Add Intent</button>}
                {reverse}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setConfirm: (confirm) => dispatch(setConfirm(confirm))
    }
}
export default connect(null, mapDispatchToProps)(IntentInputs)
