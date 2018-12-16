import React, { Component } from 'react'
import { Collapse, Alert } from 'reactstrap'
import Select from 'react-select'
import SlotMappings from '../../Editors/components/SlotMappings' 

const _ = require('lodash')

class ChoiceDropdownInputs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            choices: this.props.choices,
            intents: _.cloneDeep(this.props.intents)
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        const new_choices = props.choices.map(choice_obj => {
            delete choice_obj.invalid
            if (!choice_obj.intent || choice_obj.intent.built_in) {
                return choice_obj
            }
            const key = choice_obj.intent ? choice_obj.intent.value : null

            if(!key && key!==0) return null

            const intent = _.find(props.intents, { key: key })
            
            if (intent) {
                choice_obj.intent = {
                    label: intent.name,
                    value: key,
                    key: key,
                    inputs: intent.inputs
                }
                if(Array.isArray(choice_obj.mappings)){
                    // update labels TODO make this whole thing more efficient
                    choice_obj.mappings.forEach(mapping => {
                        if(mapping.slot && mapping.slot.key){
                            let slot = _.find(props.slots, {key: mapping.slot.key})
                            if(slot){
                                mapping.slot.label = '['+slot.name+']'
                            }
                        }
                    })
                }
                return choice_obj
            }else{
                choice_obj.invalid = true
                choice_obj.intent.inputs = null
                return choice_obj
            }
        })

        // if (props.choices.length !== current_state.choices.length) {
        //     return {
        //         choices: new_choices,
        //         open: props.open,
        //         intents: _.cloneDeep(props.intents)
        //     }
        // }

        return {
            choices: new_choices,
            intents: _.cloneDeep(props.intents)
        }
    }

    toggleCollapse(i){
        let choices = this.state.choices
        choices[i].open = !choices[i].open
        this.props.onChange(this.state.choices)
    }

    updateChoice(target, i) {
        if(Array.isArray(target)) {
            return
        }
        // check if this choice is already used
        for(var choice of this.state.choices ){
            if(choice.intent && choice.intent.label === target.label){
                this.props.onError('This intent has already been used in this intent block')
                return
            }
        }

        const choices = this.state.choices        
        delete choices[i].invalid
        choices[i].intent = target
        choices[i].mappings = choices[i].mappings.map(m => {
            return {
                variable: m.variable,
                slot: null
            }
        })
        this.setState({
            choices: choices
        }, () => {this.props.onChange(choices)})
    }

    handleAddMap(choice_i) {
        var choices = this.state.choices;
        choices[choice_i].mappings.push({
            variable: null,
            slot: null
        });

        this.setState({
            choices: choices
        }, () => {this.props.onChange(choices)});
    }

    handleRemoveMap(choice_i, i) {
        let choices = this.state.choices;

        choices[choice_i].mappings.splice(i, 1);

        this.setState({
            choices: choices
        }, () => {this.props.onChange(choices)});
    }

    handleSelection(choice_i, i, arg, value) {
        let choices = this.state.choices;
        if(choices[choice_i].mappings[i][arg] !== value){
            choices[choice_i].mappings[i][arg] = value
            this.setState({
                choices: choices
            },  () => {this.props.onChange(choices)})
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

                        // TODO: PLEASE MAKE THIS MORE EFFICIENT - CHECK IF THIS INTENT HAS NO SLOTS
                        let has_slots = false
                        for(var slot of slots){
                            if(slot.length !== 0){
                                has_slots = true
                                break 
                            }
                        }
                        if(!has_slots){
                            slots = null
                        }
                    }

                    return (
                        <div className="interaction-block mb-3" key={choice.key}>
                            <div className="interaction-title ml-1 mt-1">
                                <span onClick={() => {this.toggleCollapse(i)}}>{choice.open ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>}   {i+1}</span>
                                <button className="close" onClick={e => this.props.onRemove(e, i)}>&times;</button>
                            </div>
                            {!!choice.invalid && <Alert color="danger" className="mt-2 mb-1 py-1 text-center"><i className="fas fa-exclamation-square"/> This intent doesn't exist</Alert>}
                            <Collapse isOpen={choice.open}>
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
