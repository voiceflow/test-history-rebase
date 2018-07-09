import React, { Component } from 'react';

class ChoiceInputs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            choices: this.props.choices
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            choices: this.props.choices
        });
    }

    render() {
        return (
            <div className='ChoiceInputs'>
                <label>
                Choices:
                    {this.state.choices.map((choice, i) => {
                        return <div key={i}><input type="text" name="sfChoices" value={choice} onChange={(event) => this.props.onChange(event, i)} /></div>;
                    })}
                    <div><button onClick={this.props.onAdd}>Add Choice</button></div>
                </label>
            </div>
        );
    }
}

export default ChoiceInputs;
