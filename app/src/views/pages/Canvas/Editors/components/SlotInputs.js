import React, { Component } from 'react'
import { Input } from 'reactstrap'
import SlotInput from './SlotInput'

class SlotInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search_value: ""
        }

        this.onSearchChange = this.onSearchChange.bind(this)
        this.checkNames = this.checkNames.bind(this)
        this.onAdd = this.onAdd.bind(this)
    }

    onAdd(e){
        e.preventDefault()
        this.setState({
            search_value: ''
        })
        this.props.onAdd()
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
        return (
            <div className="w-100">
            <div>
                <Input type="search" onChange={this.onSearchChange} id="searchSlots" placeholder="Search Slots" className="mb-3 form-control-border search-input"></Input>
            </div>
                {Array.isArray(this.props.slots) ? this.props.slots.map((slot, i) => {
                    if (slot.name.indexOf(this.state.search_value) !== -1) {
                        return (
                            <SlotInput
                                key={slot.name}
                                slot={slot}
                                slot_types={this.props.slot_types}
                                nameExists={this.checkNames}
                                update={this.props.update}
                                onError={this.props.onError}
                                removeSlot={(e) => this.props.onRemove(e, i)}
                            />
                        )
                    } else {
                        return null
                    }
                }) : null }
                <div>
                    <button className="btn btn-lg btn-clear btn-block mt-3" onClick={this.onAdd}><i className="far fa-plus"></i> Add Slot</button>
                </div>
            </div>
        );
    }
}

export default SlotInputs;
