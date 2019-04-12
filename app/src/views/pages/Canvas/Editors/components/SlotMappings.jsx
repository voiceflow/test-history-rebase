import React, { Component } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux'
import { openTab } from 'actions/userActions'
import { selectStyles, variableComponent} from 'views/components/VariableSelect'

const _ = require('lodash')

class SlotMappings extends Component {

    constructor(props) {
        super(props)

        this.state = {
            slots: _.cloneDeep(this.props.slots)
        }

        this.handleAddMap = this.handleAddMap.bind(this)
        this.handleRemoveMap = this.handleRemoveMap.bind(this)
        this.handleSelection = this.handleSelection.bind(this)
    }

    handleAddMap() {
        this.props.arguments.push({
            variable: null,
            slot: null
        })

        this.props.update()
    }

    handleRemoveMap(i) {
        this.props.arguments.splice(i, 1);

        this.props.update()
    }

    handleSelection(i, arg, value) {
        if (value !== "Create Variable") {
          if (this.props.arguments[i][arg] !== value) {
            this.props.arguments[i][arg] = value;

            this.props.update();
          }
        } else {
          localStorage.setItem("tab", "variables");
          this.props.openVarTab("variables");
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.slots !== props.slots) {
          let already_added = new Set()
          let new_slot_options = []
          props.slot_options.forEach( slot_option_list => {
            slot_option_list.forEach(o => {
                if (!already_added.has(o)) {
                    // if (typeof o === "string") {
                    //     new_slot_options.push({
                    //         label: '[' + o + ']',
                    //         value: o,
                    //         key: o
                    //     })
                    // } else {
                    const slot = _.find(props.slots, { key: o })
                    if (slot) {
                        new_slot_options.push({
                            label: '[' + slot.name + ']',
                            value: o,
                            key: o
                        })
                    }
                    // }
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
                                onChange={(selected)=>this.handleSelection(i, 'slot', selected)}
                                placeholder="Slot"
                                options={this.state.slot_options}
                            />
                            <img src={'/arrow-right.svg'} className="mr-2 ml-2" width='7px' alt='map to'/>
                            <Select
                                classNamePrefix="variable-box"
                                className="map-box"
                                styles={selectStyles}
                                components={{Option: variableComponent}}
                                value={argument.variable ? {label: '{' + argument.variable + '}', variable: argument.variable} : null}
                                onChange={(selected)=>this.handleSelection(i, 'variable', selected.value)}
                                placeholder={this.props.variables.length > 0 ? "Variable" : "No Variables Exist [!]"}
                                options={Array.isArray(this.props.variables) ? this.props.variables.map((variable, idx) => {
                                    if (idx === this.props.variables.length-1){
                                        return { label: variable, value: variable, openVar: this.props.openVarTab }
                                    }
                                    return { label: '{' + variable + '}', value: variable }
                                }) : null}
                            />
                        </div>
                        <div className="close-small ml-2" onClick={() => this.handleRemoveMap(i)}></div>
                    </div>)
                })}
                <button className="btn btn-clear btn-block mb-2" onClick={this.handleAddMap}>
                    <i className="far fa-plus"></i> Add Variable Map
                </button>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        openVarTab: (tab) => dispatch(openTab(tab))
    }
}

export default connect(null, mapDispatchToProps)(SlotMappings);
