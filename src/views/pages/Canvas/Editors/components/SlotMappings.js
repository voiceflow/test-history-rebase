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
          let new_slot_options = new Set()
          props.slot_options.forEach( slot_option_list => {
            slot_option_list.forEach(o => {
                const slot = _.find(props.slots, { key: o })
                if (slot) {
                    new_slot_options.add({
                        label: '[' + slot.name + ']',
                        value: o
                    })
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
                        <div className={'variable_map'  +  (this.props.reverse ? ' reverse' : '')}>
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
                            <i className="far fa-arrow-right"/>
                            <Select
                                classNamePrefix="select-box"
                                className="map-box"
                                value={argument.slot}
                                onChange={(selected)=>this.props.handleSelection(i, 'slot', selected)}
                                placeholder="Slot"
                                options={this.state.slot_options}
                            />
                        </div>
                        <div className="close pl-2" onClick={() => this.props.onRemove(i)}>×</div>
                    </div>)
                })}
                <button className="btn btn-default btn-block" onClick={this.props.onAdd}>
                    <i className="far fa-plus"></i> Add Variable Map
                </button>
            </React.Fragment>
        );
    }
}

export default SlotMappings;
