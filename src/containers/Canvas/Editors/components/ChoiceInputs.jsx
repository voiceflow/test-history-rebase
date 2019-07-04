import Button from 'components/Button';
import React, { Component } from 'react';

import ChoiceInput from './ChoiceInput';

class ChoiceInputs extends Component {
  choicesLength = this.props.choices.length;

  shouldComponentUpdate(props) {
    if (this.choicesLength !== props.choices.length) {
      this.choicesLength = props.choices.length;
      return true;
    }

    return false;
  }

  render() {
    const { choices, inputs, onChange, onAdd, onRemove, live_mode } = this.props;

    return (
      <div className="w-100">
        {Array.isArray(choices) &&
          choices.map((choice, index) => (
            <ChoiceInput
              key={choice.key}
              index={index}
              choice={choice}
              input={inputs[index]}
              onChange={(text) => onChange(text, index)}
              onChangeChoice={(value) => {
                choices[index] = value;
              }}
              remove={() => onRemove(index)}
            />
          ))}
        <div className="text-center">
          <Button isFlat className="mt-2" onClick={onAdd} disabled={live_mode}>
            Add Choice
          </Button>
        </div>
      </div>
    );
  }
}

export default ChoiceInputs;
