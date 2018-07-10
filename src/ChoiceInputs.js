import React, { Component } from 'react';

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
            <div className='ChoiceInputs'>
                <label>
                Choices:
                    {this.state.choices.map((choice, i) => {
                        return <div key={i}>{i+1}: <input type="text" name="sfChoices" value={choice} onChange={(e) => this.props.onChange(e, i)} /><textarea name="sfInputs" value={this.state.inputs[i]} onChange={(e) => this.props.onChange(e, i)} /><button onClick={(e) => this.props.onRemove(e, i)}>&times;</button></div>;
                    })}
                    <div><button onClick={this.props.onAdd}>Add Choice</button></div>
                </label>
            </div>
        );
    }
}

export default ChoiceInputs;
