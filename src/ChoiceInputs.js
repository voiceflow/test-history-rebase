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
        $('input').keypress(function(e) {
            if (e.keyCode === 13) {
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
            <div className='ChoiceInputs'>
                <label>
                Choices:
                    {this.state.choices.map((choice, i) => {
                        return <div key={i}>{i+1}: <input type="text" name="choices" value={choice} onChange={(e) => this.props.onChange(e, i)} /><textarea name="inputs" value={this.state.inputs[i]} onChange={(e) => this.props.onChange(e, i)} /><button onClick={(e) => this.props.onRemove(e, i)}>&times;</button></div>;
                    })}
                    <div><button onClick={this.props.onAdd}>Add Choice</button></div>
                </label>
            </div>
        );
    }
}

export default ChoiceInputs;
