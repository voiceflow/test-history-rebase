import React, { Component } from 'react'
import './ChoiceDropdownInputs.css'
import { Collapse } from 'reactstrap'
import Select from 'react-select'
import SlotMappings from '../../Editors/components/SlotMappings' 

const _ = require('lodash')

class ChoiceDropdownInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            choices: this.props.choices,
            open: this.props.open,
            intents: _.cloneDeep(this.props.intents)
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        const new_choices = props.choices.map(choice_obj => {
            if (!choice_obj.intent || choice_obj.intent.built_in) {
                return choice_obj
            }
            const key = choice_obj.intent ? choice_obj.intent.value : null

            if(!key) return null

            const intent = _.find(props.intents, { key: key })
            if (intent) {
                choice_obj.intent = {
                label: intent.name,
                value: key,
                key: key,
                inputs: intent.inputs
                }
                return choice_obj
            }
            return null
        })

        if (props.choices.length !== current_state.choices.length) {
            return {
                choices: new_choices,
                open: props.open,
                intents: _.cloneDeep(props.intents)
            }
        }

        return {
            choices: new_choices,
            open: props.open,
            intents: _.cloneDeep(props.intents)
        }
    }

    toggleCollapse(i){
        const open = this.state.open;
        open[i] = !open[i]
        this.setState({
            open: open
        }, () => {this.props.onChange(this.state.choices, open)});
    }

    updateChoice(target, i) {
        if(Array.isArray(target)) {
            return
        }

        const choices = this.state.choices;
        choices[i].intent = target;
        choices[i].mappings = choices[i].mappings.map(m => {
            return {
                variable: m.variable,
                slot: null
            }
        })
        this.setState({
            choices: choices
        }, () => {this.props.onChange(choices, this.state.open)})
    }

    handleAddMap(choice_i) {
        var choices = this.state.choices;
        choices[choice_i].mappings.push({
            variable: null,
            slot: null
        });

        this.setState({
            choices: choices
        }, () => {this.props.onChange(choices, this.state.open)});
    }

    handleRemoveMap(choice_i, i) {
        let choices = this.state.choices;

        choices[choice_i].mappings.splice(i, 1);

        this.setState({
            choices: choices
        }, () => {this.props.onChange(choices, this.state.open)});
    }

    handleSelection(choice_i, i, arg, value) {
        let choices = this.state.choices;
        if(choices[choice_i].mappings[i][arg] !== value){
            choices[choice_i].mappings[i][arg] = value;

            this.setState({
                choices: choices
            },  () => {this.props.onChange(choices, this.state.open)});
        }
    }

    render() {
        return (
            <div className="w-100">
                {Array.isArray(this.state.choices) ? this.state.choices.map((choice, i) => {
                    // console.log(this.state.name_inputs_lower, this.state.search_value)
                    let slots
                    if(choice.intent && choice.intent.inputs){
                        slots = choice.intent.inputs.map(e => e.slots)
                        if(slots.length === 0) slots = null
                    }

                    return (
                        <div className="interaction-block mb-3" key={i}>
                            <div className="interaction-title ml-1 mt-1">
                                <span onClick={() => {this.toggleCollapse(i)}}>{this.state.open[i] ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>}   {i+1}</span>
                                <button className="close" onClick={e => this.props.onRemove(e, i)}>&times;</button>
                            </div>
                            <Collapse isOpen={this.state.open[i]}>
                            <div className="super-center flex-hard choice-select">
                                <Select
                                    placeholder="Select Intent"
                                    className="select-box mb-1"
                                    classNamePrefix="select-box"
                                    value={choice.intent}
                                    onChange={(e) => this.updateChoice(e, i)}
                                    options={this.props.intents.concat(this.props.built_ins).map(intent => {
                                        return {label: intent.name, value: intent.key, key: intent.key, inputs: intent.inputs, built_in: intent.built_in}
                                    })}
                                />
                            </div>
                            {!!slots && 
                                <React.Fragment>
                                    <div className="diagram-title">Slot Mapping</div>
                                    <SlotMappings
                                        variables={this.props.variables}
                                        slot_options={slots}
                                        slots={this.props.slots}
                                        arguments={choice.mappings}
                                        onAdd={() => this.handleAddMap(i)}
                                        onRemove={(index) => this.handleRemoveMap(i, index)}
                                        handleSelection={(index, arg, value) => this.handleSelection(i, index, arg, value)}
                                    />
                                </React.Fragment>
                            }
                            </Collapse>
                        </div> )
                }) : null}
                <div><button className="btn btn-clear btn-shadow btn-lg btn-block" onClick={this.props.onAdd}><i className="far fa-plus"></i> Add Choice</button></div>
            </div>
        );
    }
}

export default ChoiceDropdownInputs;
