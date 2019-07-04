import cn from 'classnames';
import Button from 'components/Button';
import randomstring from 'randomstring';
import React from 'react';
import Textarea from 'react-textarea-autosize';
import { Tooltip } from 'react-tippy';
import { Collapse } from 'reactstrap';
import { sampleUtteranceRegex } from 'services/Regex';

// so we don't need to rerender the entire choiceinput component
class ContainedTextarea extends React.PureComponent {
  state = {
    value: this.props.value,
  };

  handleChange = (e) => this.setState({ value: e.target.value.replace('\n', '').substring(0, 800) });

  render() {
    const { index, placeholder, onChange, className } = this.props;
    const { value } = this.state;

    return (
      <Textarea placeholder={placeholder} className={className} value={value} onChange={this.handleChange} onBlur={() => onChange(value, index)} />
    );
  }
}

class ChoiceInput extends React.Component {
  state = {
    samples: this.props.input
      .split('\n')
      .filter((text) => text.trim())
      .map((text) => ({ text, key: randomstring.generate(5) })),
    text: '',
  };

  sampleLength = this.state.samples.length;

  inputRef = React.createRef();

  componentWillUnmount() {
    if (this.state.samples.length === 0 && this.state.text.trim()) {
      this.props.onChange(this.state.text.trim());
    }
  }

  shouldComponentUpdate(props, state) {
    if (this.sampleLength !== state.samples.length || this.props.index !== props.index) {
      this.sampleLength = state.samples.length;
      return true;
    }

    if (this.state.text !== state.text || this.state.text_error !== state.text_error) {
      return true;
    }

    return false;
  }

  focus() {
    setTimeout(() => this.inputRef.current && this.inputRef.current.focus(), 150);
  }

  handleKeyPress = (e) => {
    // Enter key pressed
    // Add utterance
    if (e.charCode === 13) {
      e.preventDefault();
      this.addUtterance();
    }
  };

  addUtterance = () => {
    const newValue = this.state.text.trim();

    if (!newValue) {
      return;
    }
    // invalid utterance
    const escapedValue = newValue.replace(/({{\[)|(].[\dA-Za-z]+}})/g, '');
    if (escapedValue.match(sampleUtteranceRegex)) {
      this.setState({
        text_error:
          'Sample choices can consist of only unicode characters, spaces, periods for abbreviations, underscores, possessive apostrophes, curly braces, and hyphens',
      });
      return;
    }

    const utterance = {
      text: newValue,
      key: randomstring.generate(5),
    };

    this.state.samples.push(utterance);
    this.updateInput();
    this.setState({ text: '' });
  };

  deleteUtterance(e, i) {
    e.preventDefault();
    this.state.samples.splice(i, 1);
    this.forceUpdate();
    this.updateInput();
  }

  updateInput() {
    this.props.onChange(this.state.samples.map((s) => s.text).join('\n'));
  }

  onTextChange = (e) =>
    this.setState({
      text: e.target.value,
      text_error: null,
    });

  updateSample = (text, i) => {
    const samples = this.state.samples;
    samples[i].text = text;
    this.setState({ samples });
    this.updateInput();
  };

  renderUtterances(utterances) {
    if (!Array.isArray(utterances)) {
      return null;
    }

    return utterances.map((utterance, i) => {
      if (i === 0) {
        return null;
      }

      const index = utterances.length - i;
      return (
        <div className="choice-utterance" key={utterance.key}>
          <ContainedTextarea value={utterance.text} index={index} onChange={this.updateSample} />
          <i
            onClick={(e) => {
              this.deleteUtterance(e, index);
            }}
            className="fas fa-backspace trash-icon mt-2"
          />
        </div>
      );
    });
  }

  toggleOpen = () => {
    this.props.choice.open = !this.props.choice.open;
    this.forceUpdate();
  };

  render() {
    const hasEntry = this.state.samples.length > 0;
    const { choice, index, live_mode } = this.props;
    const { samples, text, text_error } = this.state;

    return (
      <div className="interaction-block">
        <div className="choice-title">
          <span>{index + 1}</span>
          <Button className="close" onClick={() => this.props.remove()} disabled={live_mode} />
        </div>
        {hasEntry && (
          <div>
            <ContainedTextarea
              placeholder="Enter user reply"
              className="form-control user-input mb-2"
              value={samples[0].text}
              index={0}
              onChange={this.updateSample}
            />
            <div className="space-between pointer ml-1 mb-1" onClick={this.toggleOpen}>
              <div className="section-title">Synonyms ({samples.length - 1})</div>
              <i
                className={cn('text-muted', 'fas', 'fa-caret-down', 'rotate', {
                  'fa-rotate-90': !choice.open,
                })}
              />
            </div>
          </div>
        )}
        <Collapse isOpen={choice.open || !hasEntry}>
          <Tooltip className="flex-hard" theme="warning" arrow={true} position="bottom-start" open={!!text_error} distance={5} html={text_error}>
            <Textarea
              className={cn('form-control', {
                'mb-1': samples.length === 1,
              })}
              value={text}
              onChange={this.onTextChange}
              placeholder={samples.length ? 'Enter synonyms of the user reply' : 'Enter user reply'}
              disabled={live_mode}
              onKeyPress={this.handleKeyPress}
              inputRef={this.inputRef}
            />
          </Tooltip>
          {!hasEntry && (
            <div className="space-between my-2 pl-1">
              <small className="text-muted">
                Press <b>'Enter'</b> to add
              </small>
              <span className="key-bubble forward pointer" onClick={this.addUtterance}>
                <i className="far fa-long-arrow-right" />
              </span>
            </div>
          )}
          {hasEntry && this.renderUtterances(samples)}
        </Collapse>
      </div>
    );
  }
}

export default ChoiceInput;
