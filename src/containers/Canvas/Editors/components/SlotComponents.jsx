import randomstring from 'randomstring';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { components } from 'react-select';
import Textarea from 'react-textarea-autosize';

import { setError } from '@/ducks/modal';

import ContainedTextarea from './ContainedTextArea';

const synonymsToBadges = (synonyms) =>
  synonyms
    .split(',')
    .map((e) => e.trim())
    .map((s, i) => {
      if (i === 0) {
        return (
          <div key={i} className="my-1">
            {s}
          </div>
        );
      }
      return (
        <span key={i} className="slot-synonym">
          {s}
        </span>
      );
    });

const SlotOption = (props) => {
  const is_alexa = /AMAZON/.test(props.data.value);
  const is_google = /^@sys\./.test(props.data.value);
  const is_global = !is_alexa && !is_google;

  const is_custom = props.data.label === 'Custom';

  return (
    <components.Option {...props}>
      <div className="d-flex slot-label justify-content-between">
        <span className="mr-2">{props.data.label}</span>
        <span className="d-flex">
          {!is_custom && (is_alexa || is_global) && <i className="fab fa-amazon align-self-center" />}
          {!is_custom && (is_google || is_global) && <i className="fab fa-google align-self-center" />}
        </span>
      </div>
    </components.Option>
  );
};

const SingleValueOption = (props) => {
  const is_alexa = /AMAZON/.test(props.data.value);
  const is_google = /^@sys\./.test(props.data.value);
  const is_global = !is_alexa && !is_google;

  const is_custom = props.data.label === 'Custom';

  return (
    <components.SingleValue {...props}>
      <div className="d-flex slot-label justify-content-between">
        <span className="mr-2">{props.data.label}</span>
        <span className="d-flex">
          {!is_custom && (is_alexa || is_global) && <i className="fab fa-amazon align-self-center" />}
          {!is_custom && (is_google || is_global) && <i className="fab fa-google align-self-center" />}
        </span>
      </div>
    </components.SingleValue>
  );
};

const SlotDiabled = (slot_type, platform) => {
  return (/AMAZON/.test(slot_type) && platform !== 'alexa') || (/^@sys\./.test(slot_type) && platform !== 'google');
};

class SlotSynonyms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      inputs: this.props.inputs.filter((e) => e.trim()),
      focus: null,
    };
    this.slot_refs = {};

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.addValue = this.addValue.bind(this);
    this.onDeleteExample = this.onDeleteExample.bind(this);
    this.renderUtterances = this.renderUtterances.bind(this);
    this.beginSlotEdit = this.beginSlotEdit.bind(this);
  }

  addValue() {
    const newValue = this.state.text;

    if (newValue) {
      if (this.props.inputs.includes(newValue)) {
        return this.props.setError('Duplicate value in slot');
      }

      this.props.inputs.push(newValue);
      this.setState({
        text: '',
      });
      this.props.update();
    }
  }

  updateInputText(text, i) {
    if (this.state.focus === i) {
      this.setState({
        focus: null,
      });
    }
    const inputs = this.props.inputs;
    if (text) {
      inputs[i] = text;
    } else {
      this.props.inputs.splice(i, 1);
    }
    this.props.update();
  }

  beginSlotEdit(i) {
    this.setState({ focus: i });
  }

  renderUtterances = (utterances, deleteExample) => {
    if (Array.isArray(utterances)) {
      return utterances.map((u, i) => {
        return (
          <div className="slot-utterance" key={randomstring.generate(5)}>
            {this.state.focus === i ? (
              <ContainedTextarea
                placeholder="Enter user reply"
                value={this.props.inputs[i]}
                onChange={(text) => this.updateInputText(text, i)}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
            ) : (
              <div onClick={() => this.beginSlotEdit(i)}>{synonymsToBadges(this.props.inputs[i])}</div>
            )}
            <i onClick={() => deleteExample(i)} className="fas fa-backspace trash-icon mt-1" />
          </div>
        );
      });
    }
    return null;
  };

  onDeleteExample(i) {
    this.props.inputs.splice(i, 1);
    this.props.update();
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

  render() {
    return (
      <React.Fragment>
        <div>{this.renderUtterances(this.props.inputs, this.onDeleteExample)}</div>
        <Textarea
          className="slot-input"
          name="inputs"
          value={this.state.text}
          onKeyPress={this.handleKeyPress}
          onChange={this.onTextChange}
          placeholder={this.props.placeholder || 'Enter Slot Content Example'}
        />
        <div className="text-center mt-2">
          <span className="key-bubble forward pointer" onClick={this.addValue}>
            <i className="far fa-long-arrow-right" />
          </span>
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setError: (err) => dispatch(setError(err)),
  };
};
export { SlotOption, SingleValueOption, SlotDiabled, SlotSynonyms };
export default connect(
  null,
  mapDispatchToProps
)(SlotSynonyms);
