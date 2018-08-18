import React, { Component } from 'react';
import $ from 'jquery';
import Textarea from 'react-textarea-autosize';

class ChoiceInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            choices: this.props.choices,
            inputs: this.props.inputs
        };
    }

    componentDidMount() {
        $('*').keypress(function(e) {
            if ((e.keyCode === 13 || e.which === 13) && e.target.name !== 'inputs' && !e.target.name.endsWith('Text')) {
                e.preventDefault();
            }
        });
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
                        <div key={i} className="choice-block">
                            <div className="choice-title">
                                <span>#{i+1}</span>
                                <input type="text" name="choices" value={choice} onChange={e => this.props.onChange(e, i)} />
                                <button className="close" onClick={e => this.props.onRemove(e, i)}>&times;</button>
                            </div>
                            <Textarea 
                                name="inputs" 
                                value={this.state.inputs[i]} 
                                onChange={e => this.props.onChange(e, i)}
                                placeholder="Add Choice Prompts Here" 
                            />
                        </div> )
                }) : null}
                <div><button className="btn btn-outline-secondary btn-block" onClick={this.props.onAdd}>Add Choice <i className="fas fa-plus-circle ml-1"></i></button></div>
            </div>
        );
    }
}

export default ChoiceInputs;
