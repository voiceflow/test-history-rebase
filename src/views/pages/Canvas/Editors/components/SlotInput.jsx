import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import { Collapse } from 'reactstrap';
import Select, { components } from 'react-select'
import {Tooltip} from 'react-tippy'

class SlotInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: '',
            text_error: null,
            name: (this.props.slot && this.props.slot.name) ? this.props.slot.name : '',
            name_error: null
        }
        this.toggleCollapse = this.toggleCollapse.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.onTextChange = this.onTextChange.bind(this)
        this.onDeleteExample = this.onDeleteExample.bind(this)
        this.onNameSave = this.onNameSave.bind(this)
        this.onNameChange = this.onNameChange.bind(this)
        this.updateSlotType = this.updateSlotType.bind(this)
        this.addValue = this.addValue.bind(this)
    }

    toggleCollapse(){
        this.props.slot.open = !this.props.slot.open
        this.props.update()
    }

    handleKeyPress(e) {
        // Enter key pressed
        if(e.charCode===13){
            e.preventDefault();
            this.addValue()
        }
    }

    addValue(){
        const newValue = this.state.text;
        if (!Array.isArray(this.props.slot.inputs)) {
            this.props.slot.inputs = [];
        }

        if (this.props.slot.inputs.includes(newValue)) {
            return this.props.onError('Duplicate value in slot')
        }

        if (newValue) {
            this.props.slot.inputs.push(newValue);
            this.setState({
                text: ''
            })
            this.props.update()
        }
    }

    onTextChange(e) {
        this.setState({
            text: e.target.value
        })
    }

    onDeleteExample(i) {
        this.props.slot.inputs.splice(i, 1);
        this.props.update()
    }

    onNameChange(e) {
        const input = e.target.value.toLowerCase().replace(/\s/g, '_')
        const re = /^[_a-z]+$/g

        let name_error
        if (!re.test(input) && input.length > 0) {
            name_error = 'Slot names can only contain lowercase letters and underscores!'
        } else {
            name_error = null
        }
        this.setState({
            name: input,
            name_error: name_error
        })
    }

    onNameSave(e) {
        e.preventDefault()
        if(this.state.name === this.props.slot.name){
            return
        }else if(this.state.name_error){
            this.props.onError(this.state.name_error)
            this.setState({
                name: this.props.slot.name,
                name_error: null
            })
        }else if(!this.state.name.trim()) {
            this.setState({
                name: this.props.slot.name
            })
        }else if(this.props.nameExists(this.state.name)){
            // save name with error callback
            this.props.onError('An slot already exists with this name')
            this.setState({
                name: this.props.slot.name
            })
        }else{
            this.props.slot.name = this.state.name
        }
    }

    updateSlotType(target) {
        this.props.slot.type = target;
        this.props.update()
    }

    onSearchChange(e) {
        this.setState({
            search_value: e.target.value.toLowerCase()
        })
    }

    renderUtterances = (utterances) => {
        if (Array.isArray(utterances)) {
            return utterances.map( (u, i) => {
                return <div className="interaction-utterance" key={i}><div>{u}</div><i onClick={() => {this.onDeleteExample(i)}} className="fas fa-backspace trash-icon"></i></div>
            });
        }
        return null
    }

    render() {

        const SlotOption = (props) => {
            const is_alexa = /AMAZON/.test(props.data.value)
            const is_google = /^@sys\./.test(props.data.value)
            const is_global = !is_alexa && !is_google

            const is_custom = props.data.label === 'Custom'

            return (
                    <components.Option {...props}>
                        <div className="d-flex slot-label justify-content-between">
                            <span className="mr-2">{props.data.label}</span>
                            <span className="d-flex">
                                {!is_custom && (is_alexa || is_global) && <i className="fab fa-amazon align-self-center"/>}
                                {!is_custom && (is_google || is_global) && <i className="fab fa-google align-self-center"/>}
                            </span>
                        </div>
                    </components.Option>
            )
        }

        const SingleValueOption = (props) => {
            const is_alexa = /AMAZON/.test(props.data.value)
            const is_google = /^@sys\./.test(props.data.value)
            const is_global = !is_alexa && !is_google

            const is_custom = props.data.label === 'Custom'

            return (
                <components.SingleValue {...props}>
                    <div className="d-flex slot-label justify-content-between">
                        <span className="mr-2">{props.data.label}</span>
                        <span className="d-flex">
                            {!is_custom && (is_alexa || is_global) && <i className="fab fa-amazon align-self-center"/>}
                            {!is_custom && (is_google || is_global) && <i className="fab fa-google align-self-center"/>}
                        </span>
                    </div>
                </components.SingleValue>
            )
        }

        let disabled = false
        const slot_type = this.props.slot.type.value
        if ((/AMAZON/.test(slot_type) && !(this.props.platform === 'alexa')) || (/^@sys\./.test(slot_type) && !(this.props.platform === 'google'))) disabled = true

        return (
            <div className={`interaction-block mb-2`}>
                <div className={`intent-title ${ disabled ? 'faded' : ''}`}>
                    <span onClick={this.toggleCollapse}><i className={"fas fa-caret-right rotate" + (this.props.slot.open ? " fa-rotate-90" : "")}></i></span>
                    <Tooltip
                        className="flex-hard"
                        theme="warning"
                        arrow={true}
                        position="bottom-start"
                        open={!!(this.state.name_error)}
                        distance={5}
                        html={this.state.name_error}
                    >
                        <input placeholder="Enter Slot Name" 
                            type="text"
                            value={this.state.name}
                            onChange={this.onNameChange}
                            onBlur={this.onNameSave}
                            onKeyPress={(e)=>{if(e.charCode===13){e.preventDefault()}}}
                            className="interaction-name-input"
                        />
                    </Tooltip>                                
                    <button className="close" onClick={()=>this.props.removeSlot(this.props.slot.key)} disabled={this.props.live_mode}>&times;</button>
                </div>
                <Collapse isOpen={this.props.slot.open}>
                    {disabled && <div className='unavailable-input'><div><i className="fas fa-frown"></i></div>This Slot Type is Unavailable on {(this.props.platform === 'google') ? 'Google Assistant' : 'Alexa'}</div>}
                    <div className={disabled ? 'disabled faded' : ''}>
                        <div className="super-center flex-hard choice-select">
                            <Select
                                placeholder="Select Slot Type"
                                classNamePrefix="select-box"
                                className='select-box mb-2'
                                value={this.props.slot.type}
                                onChange={this.updateSlotType}
                                options={this.props.slot_types.map(type => {
                                    let value
                                    if ((type.type.alexa && type.type.google) || (!type.type.alexa && !type.type.google)) {
                                        value = type.label
                                    } 
                                    else if (type.type.alexa && !type.type.google) {
                                        value = type.type.alexa
                                    }
                                    else if (!type.type.alexa && type.type.google) {
                                        value = type.type.google
                                    }

                                    return {label: type.label, value: value}
                                })}
                                components={{ Option: SlotOption, SingleValue: SingleValueOption }}
                                styles={{
                                    singleValue: (base) => ({ ...base, width: '100%' }),
                                }}
                                isDisabled={this.props.live_mode}
                                />
                        </div>
                        <hr className="mt-1 mb-2"/>
                        <div>
                            {this.renderUtterances(this.props.slot.inputs)}
                        </div>
                        <Textarea 
                            className="slot-input"
                            name="inputs"
                            value={this.state.text} 
                            onKeyPress={this.handleKeyPress}
                            onChange={this.onTextChange}
                            placeholder="Enter Slot Content Example" 
                        />
                        <div className="text-center mt-2">
                            <span className="key-bubble forward pointer" onClick={this.addValue}><i className="far fa-long-arrow-right"/></span>
                        </div>
                    </div>
                </Collapse>
            </div> 
        )
    }
}

export default SlotInput;
