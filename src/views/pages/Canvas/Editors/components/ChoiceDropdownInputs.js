import React, { Component } from 'react';
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
            intents: _.cloneDeep(this.props.intents),
            mappings: this.props.mappings
        };
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.intents !== props.intents) {
          const new_choices = props.choices.map(choice_obj => {
            if (!choice_obj.intent || choice_obj.intent.built_in) {
              return choice_obj
            }
            const key = choice_obj.intent ? choice_obj.intent.value : null
            const intent = _.find(props.intents, { key: key })
            if (intent) {
              choice_obj.intent = {
                label: intent.name,
                value: key,
                inputs: intent.inputs
              }
              return choice_obj
            } 
          })
          return {
            choices: new_choices,
            open: props.open,
            intents: _.cloneDeep(props.intents),
            mappings: props.mappings
          }
        }
        return null
    }

    toggleCollapse(i){
        const open = this.state.open;
        open[i] = !open[i]
        this.setState({
            open: open
        }, () => {this.props.onChange(this.state.choices, open)});
    }

    onNameChange(e, i) {
        e.preventDefault()
        const choices = this.state.choices;
        choices[i].name = e.target.value
        this.setState({
            choices: choices
        }, () => {this.props.onChange(choices, this.state.open)})
    }

    getSelectValue(i) {
        const intent_key = this.state.choices[i].intent
        const intent = _.find(this.props.intents, { key: intent_key }).name
        return { label: intent.name, value: intent.key }
    }

    updateChoice(target, i) {
        const choices = this.state.choices;
        choices[i].intent = target;
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
                    return (
                        <div className="interaction-block" key={i}>
                            <a>
                                <div className="interaction-title">
                                    <span onClick={() => {this.toggleCollapse(i)}}>{this.state.open[i] ? <i className="fas fa-caret-down"></i> : <i className="fas fa-caret-right"></i>}   {i+1}</span>
                                    <input placeholder="Enter choice Name" 
                                        type="text"
                                        value={choice.name}
                                        onChange={(e) => {this.onNameChange(e, i)}}
                                        onKeyPress={ (e) => {if(e.charCode==13){e.preventDefault()}}}
                                        className="interaction-name-input"
                                    />
                                    <button className="close" onClick={e => this.props.onRemove(e, i)}>&times;</button>
                                </div>
                            </a>
                            <Collapse isOpen={this.state.open[i]}>
                              <div className="super-center flex-hard choice-select">
                                <div>Intent</div>
                                <Select
                                    placeholder="Select Intent"
                                    className="input-select"
                                    value={choice.intent}
                                    onChange={(e) => this.updateChoice(e, i)}
                                    options={this.props.intents.concat(this.props.built_ins).map(intent => {
                                        return {label: intent.name, value: intent.key, key: intent.key, inputs: intent.inputs, built_in: intent.built_in}
                                    })}
                                />
                              </div>
                              <div className="diagram-title">Output Variables</div>
                              <SlotMappings
                                  reverse
                                  variables={this.props.variables}
                                  slot_options={choice.intent ? choice.intent.inputs.map(e => e.slots) : []}
                                  slots={this.props.slots}
                                  arguments={choice.mappings}
                                  onAdd={() => this.handleAddMap(i)}
                                  onRemove={(index) => this.handleRemoveMap(i, index)}
                                  handleSelection={(index, arg, value) => this.handleSelection(i, index, arg, value)}
                              />
                            </Collapse>
                        </div> )
                }) : null}
                <div><button className="btn btn-default btn-block" onClick={this.props.onAdd}><i className="far fa-plus"></i> Add Choice</button></div>
            </div>
        );
    }
}

export default ChoiceDropdownInputs;
