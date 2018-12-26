import React, { Component } from 'react'
import { Input } from 'reactstrap'
import SlotInput from './SlotInput'
import randomstring from 'randomstring'
import converter from 'number-to-words'
const _getIndex = (index) => {
    return converter.toWords(index).replace(/\s/g, '_').replace(/,/g,'').replace(/-/g,'_')
}

class SlotInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search_value: ""
        }

        this.onSearchChange = this.onSearchChange.bind(this)
        this.checkNames = this.checkNames.bind(this)

        this.handleAddSlot = this.handleAddSlot.bind(this)
        this.handleRemoveSlot = this.handleRemoveSlot.bind(this)
    }

    handleAddSlot() {
        let name = 'slot_' + _getIndex(this.props.slots.length+1)

        const find = (name) => this.props.slots.find(e => e.name === name)
        while(find(name)) {
            name = 'new_' + name
        }

        this.props.slots.push({name: name, inputs: [], type: '', key: randomstring.generate(12), open: true})
        this.props.update()

        this.setState({
            search_value: ''
        })
    }

    handleRemoveSlot(key) {
        const used_slots = new Set();
        const slot_names = {}

        this.props.intents.forEach(intent => {
            const utterances = intent.inputs
            utterances.forEach( u => u.slots.forEach(s => {
                used_slots.add(s)
                slot_names[s] = intent.name
            }))
        })

        if (used_slots.has(key)) {
            const error = `Cannot remove slot as it is currently being used in an intent (${slot_names[key]})!`
            this.setState({
                error: error
            })
        } else {
            let i = this.props.slots.findIndex(i => i.key === key)
            if(i !== -1){
                this.props.slots.splice(i, 1)
                this.props.update()
            }
        }
    }

    onSearchChange(e) {
        this.setState({
            search_value: e.target.value.toLowerCase()
        })
    }

    checkNames(name) {
        return this.props.slots.findIndex(i => i.name === name) !== -1
    }

    render() {
        let length = 0
        let reverse
        if(Array.isArray(this.props.slots)){
            length = this.props.slots.length
            reverse = []
            let i
            for(i=this.props.slots.length-1; i >= 0 ; i--){
                let slot = this.props.slots[i]

                if (slot.name.indexOf(this.state.search_value) !== -1) {
                    reverse.push(<SlotInput
                        key={slot.key}
                        slot={slot}
                        slot_types={this.props.slot_types}
                        nameExists={this.checkNames}
                        update={this.props.update}
                        onError={this.props.onError}
                        removeSlot={this.handleRemoveSlot}
                    />)
                }
            }
        }

        return (
            <div className="w-100">
                {length > 4 && <Input type="search" onChange={this.onSearchChange} id="searchSlots" placeholder="Search Slots" className="mb-3 form-control-border search-input" value={this.state.search_value}></Input>}
                {length < 251 && <button className="btn btn-lg btn-clear btn-block mb-3" onClick={this.handleAddSlot}><i className="far fa-plus"></i> Add Slot</button>}
                {reverse}
            </div>
        );
    }
}

export default SlotInputs;
