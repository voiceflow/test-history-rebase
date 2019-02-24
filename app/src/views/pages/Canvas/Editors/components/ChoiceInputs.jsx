import React, { Component } from 'react'
import ChoiceInput from './ChoiceInput'

class ChoiceInputs extends Component {
    constructor(props){
        super(props)
        this.choices_length = props.choices.length
    }

    shouldComponentUpdate(props, state) {
        if(this.choices_length !== props.choices.length){
            this.choices_length = props.choices.length
            return true
        }
        return false
    }

    render() {
        return (
            <div className="w-100">
                {Array.isArray(this.props.choices) ? this.props.choices.map((c, i) => {
                    return (<ChoiceInput
                        key={c.key}
                        index={i}
                        choice={c}
                        input={this.props.inputs[i]}
                        onChange={text => this.props.onChange(text, i)}
                        onChangeChoice={choice => {
                            let choices = this.props.choices
                            choices[i] = choice
                        }}
                        remove={()=>this.props.onRemove(i)}
                    />)
                }) : null}
                <div><button className="btn btn-clear btn-lg btn-block" onClick={this.props.onAdd} disabled={this.props.live_mode}><i className="far fa-plus"></i> Add Choice</button></div>
            </div>
        );
    }
}

export default ChoiceInputs;
