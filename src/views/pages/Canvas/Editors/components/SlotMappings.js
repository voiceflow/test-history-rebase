import React, { Component } from 'react';
import Select from 'react-select';
import './SlotInputs.css'

const _ = require('lodash')

class SlotMappings extends Component {

    constructor(props) {
        super(props)

        this.state = {
            slots: _.cloneDeep(this.props.slots)
        }

    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.slots !== props.slots) {
          let already_added = new Set()
          let new_slot_options = []
          props.slot_options.forEach( slot_option_list => {
            slot_option_list.forEach(o => {
                if (!already_added.has(o)) {
                    if (typeof o === "string") {
                        new_slot_options.push({
                            label: '[' + o + ']',
                            value: o,
                            key: o
                        })
                    } else {
                        const slot = _.find(props.slots, { key: o })
                        if (slot) {
                            new_slot_options.push({
                                label: '[' + slot.name + ']',
                                value: o,
                                key: o
                            })
                        }
                    }
                    already_added.add(o)
                }
            })
          })
          return {
            slot_options: Array.from(new_slot_options),
            slots: _.cloneDeep(props.slots)
          }
        }
        return null
    }

    render() {
        return (
            <React.Fragment>
                {this.props.arguments.map((argument, i) => {
                    return (<div key={i} className="super-center mb-2">
                        <div className='variable_map'>
                            <Select
                                classNamePrefix="select-box"
                                className="map-box"
                                value={argument.slot}
                                onChange={(selected)=>this.props.handleSelection(i, 'slot', selected)}
                                placeholder="Slot"
                                options={this.state.slot_options}
                            />
                            <i className="far fa-arrow-right"/>
                            <Select
                                classNamePrefix="variable-box"
                                className="map-box"
                                value={argument.variable ? {label: '{' + argument.variable + '}', variable: argument.variable} : null}
                                onChange={(selected)=>this.props.handleSelection(i, 'variable', selected.value)}
                                placeholder={this.props.variables.length > 0 ? "Variable" : "No Variables Exist [!]"}
                                options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                                    return {label: '{' + variable + '}', value: variable}
                                }) : []}
                            />
                        </div>
                        <div className="close pl-2" onClick={() => this.props.onRemove(i)}>×</div>
                    </div>)
                })}
                <button className="btn btn-clear btn-block mb-2" onClick={this.props.onAdd}>
                    <i className="far fa-plus"></i> Add Variable Map
                </button>
            </React.Fragment>
        );
    }
}

export default SlotMappings;
