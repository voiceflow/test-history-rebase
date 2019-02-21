import React, { Component } from 'react'
import Select from 'react-select'
import { SingleValueOption, SlotOption, SlotSynonyms } from './components/SlotComponents'

class Capture extends Component {
    constructor(props) {
        super(props);
        
        let node = this.props.node
        if(!Array.isArray(node.extras.slot_inputs)){
            node.extras.slot_inputs = []
        }

        this.state = {
            node: node
        }

        this.handleSelection = this.handleSelection.bind(this)
        this.updateSlotType = this.updateSlotType.bind(this)
        this.update = this.update.bind(this)
    }

    update(){
        this.forceUpdate()
        this.props.onUpdate()
    }

    handleSelection(selected){
        let node = this.state.node
        node.extras.variable = selected.value

        this.setState({
            node: node
        }, this.props.onUpdate)
    }

    updateSlotType(target) {
        let node = this.state.node
        node.extras.slot_type = target
        this.setState({
            node: node
        }, this.props.onUpdate)
    }

    render() {
        return (
            <div>
                {this.props.platform === 'alexa' && <React.Fragment>
                    <label>Input Type <small>(required)</small></label>
                    <Select
                        placeholder="Select Slot Type"
                        classNamePrefix="select-box"
                        className='select-box mb-3'
                        value={this.state.node.extras.slot_type}
                        onChange={this.updateSlotType}
                        options={this.props.slot_types}
                        components={{ Option: SlotOption, SingleValue: SingleValueOption }}
                        styles={{
                            singleValue: (base) => ({ ...base, width: '100%' }),
                        }}
                        isDisabled={this.props.live_mode}
                    />
                    {this.state.node.extras.slot_type && this.state.node.extras.slot_type.label === 'Custom' && <SlotSynonyms
                        inputs={this.state.node.extras.slot_inputs}
                        update={this.update}
                        onError={this.props.onError}
                        placeholder="Custom Input Example"
                    />}
                    <hr/>
                </React.Fragment>}
                <label>Capture Input to: </label>
                <Select
                    classNamePrefix="variable-box"
                    placeholder={this.props.variables.length > 0 ? "Variable Name" : "No Variables Exist [!]"}
                    className="variable-box"
                    value={this.state.node.extras.variable ? {label: '{' + this.state.node.extras.variable + '}', value: this.state.node.extras.variable} : null}
                    onChange={this.handleSelection}
                    options={Array.isArray(this.props.variables) ? this.props.variables.map(variable => {
                        return {label: '{' + variable + '}', value: variable}
                    }) : null}
                />
            </div>
        );
    }
}

export default Capture;
