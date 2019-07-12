import update from 'immutability-helper';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Textarea from 'react-textarea-autosize';

import { setError } from '@/ducks/modal';

class FulfillInput extends PureComponent {
  constructor(props) {
    super(props);
    const { slot, slot_config } = this.props;

    this.state = {
      slot,
      slot_config,
      text: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.addValue = this.addValue.bind(this);
    this.slotValues = this.slotValues.bind(this);
    this.onRemoveSlotFulfillment = this.onRemoveSlotFulfillment.bind(this);
  }

  handleKeyPress(e) {
    // Enter key pressed
    if (e.charCode === 13) {
      e.preventDefault();
      this.addValue();
    }
  }

  onTextChange(e) {
    this.setState({
      text: e.target.value,
    });
  }

  addValue = async () => {
    const { slot_config, setError, updateSlotConfig, onInputUpdate } = this.props;
    const { text: newValue } = this.state;

    if (!Array.isArray(slot_config)) {
      throw new Error("Slot Array Doesn't Exist!");
    }

    if (slot_config.includes(newValue)) {
      return setError('Duplicate value in slot');
    }

    if (newValue) {
      const newSlotConfig = update(slot_config, {
        $push: [newValue],
      });
      this.setState({
        text: '',
      });
      await updateSlotConfig(newSlotConfig);
    }
    onInputUpdate();
  };

  slotValues() {
    const { slot_values } = this.props;
    if (slot_values) {
      return slot_values.map((value, i) => {
        return (
          <div className="fulfill-value interaction-utterance" key={i}>
            <div>{value}</div>
            <i
              onClick={() => {
                this.onRemoveSlotFulfillment(i);
              }}
              className="fas fa-backspace trash-icon"
            />
          </div>
        );
      });
    }
    return null;
  }

  onRemoveSlotFulfillment = async (i) => {
    const { slot_config, updateSlotConfig, onInputUpdate } = this.props;

    const newSlotConfig = update(slot_config, {
      $splice: [[i, 1]],
    });
    await updateSlotConfig(newSlotConfig);
    onInputUpdate();
  };

  render() {
    const { slot } = this.props;
    const { text } = this.state;

    return (
      <div>
        <div>{this.slotValues()}</div>
        <Textarea
          className="slot-input"
          name="inputs"
          value={text}
          onKeyPress={this.handleKeyPress}
          onChange={this.onTextChange}
          placeholder="Enter Slot Fulfillment Value"
        />
        <div className="text-center mt-2">
          <span
            className="key-bubble forward pointer"
            onClick={() => {
              this.addValue(slot.key);
            }}
          >
            <i className="far fa-long-arrow-right" />
          </span>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setError: (err) => dispatch(setError(err)),
  };
};
export default connect(
  null,
  mapDispatchToProps
)(FulfillInput);
