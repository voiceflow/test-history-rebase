import React, { Component } from 'react';
import $ from 'jquery';

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
            <label>
                Choices:
                {Array.isArray(this.state.choices) ? this.state.choices.map((choice, i) => {
                    return <div key={i}>{i+1}: <input type="text" name="choices" value={choice} onChange={e => this.props.onChange(e, i)} /><button onClick={e => this.props.onRemove(e, i)}>&times;</button><textarea name="inputs" value={this.state.inputs[i]} onChange={e => this.props.onChange(e, i)} /></div>;
                }) : null}
                <div><button onClick={this.props.onAdd}>Add Choice</button></div>
            </label>
        );
    }
}

export default ChoiceInputs;
