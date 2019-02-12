import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';

class ChoiceInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            choices: this.props.choices,
            inputs: this.props.inputs
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            choices: props.choices,
            inputs: props.inputs
        });
    }

    render() {
        return (
            <div className="w-100">
                {Array.isArray(this.state.choices) ? this.state.choices.map((choice, i) => {
                    return (
                        <div key={i} className="choice-block mb-3">
                            <div className="choice-title">
                                <span>{i+1}</span>
                                <button className="close" onClick={e => this.props.onRemove(e, i)} disabled={this.props.live_mode}>&times;</button>
                            </div>
                            <Textarea 
                                name="inputs" 
                                value={this.state.inputs[i]} 
                                onChange={e => this.props.onChange(e, i)}
                                placeholder="Enter user reply (new line for synonyms)" 
                                disabled={this.props.live_mode}
                            />
                        </div> )
                }) : null}
                <div><button className="btn btn-clear btn-lg btn-block" onClick={this.props.onAdd} disabled={this.props.live_mode}><i className="far fa-plus"></i> Add Choice</button></div>
            </div>
        );
    }
}

export default ChoiceInputs;
