import React, { Component } from 'react';
import './IntentInputs.css'
import { Collapse } from 'reactstrap'
import Select from 'react-select'

const _ = require('lodash')

class ChoiceDropdownInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            choices: this.props.choices,
            open: this.props.open,
        };
    }

    toggleCollapse(i){
        const open = this.state.open;
        open[i] = !open[i]
        this.setState({
            open: open
        }, () => {this.props.onChange(this.state.choices, open)});
    }

    componentWillReceiveProps(props) {
        this.setState({
            choices: props.choices,
            open: this.props.open
        })
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
        choices[i].intent = target.value;
        this.setState({
            choices: choices
        }, () => {this.props.onChange(choices, this.state.open)})
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
                            <Select
                                placeholder="Select Intent"
                                className="select-box input-select"
                                value={this.state.choices[i].intent}
                                onChange={(e) => this.updateChoice(e, i)}
                                options={this.props.intents.map(intent => {
                                    return {label: intent.name, value: intent.key}
                                })}
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
