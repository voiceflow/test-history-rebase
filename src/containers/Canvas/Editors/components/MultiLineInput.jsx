import Button from 'components/Button';
import AudioDrop from 'components/Uploads/AudioDrop';
import React, { Component } from 'react';
import Select from 'react-select';
import Textarea from 'react-textarea-autosize';
import { Collapse } from 'reactstrap';

function onGenerate() {
  alert('Text to Speech is Deprecated - Please Use the Speak Block');
}

class MultiLineInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      line: this.props.line,
      voices: this.props.voices,
      index: this.props.index,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(props) {
    this.setState({
      line: props.line,
      voices: props.voices,
      index: props.index,
    });
  }

  handleChange(e) {
    const line = this.state.line;
    const name = e.target.getAttribute('name');
    const value = e.target.value;
    line[name] = value;
    this.setState(
      {
        line,
      },
      this.props.onUpdate
    );
  }

  handleSelection(selected) {
    const line = this.state.line;
    line.voice = selected.value;

    this.setState(
      {
        line,
      },
      this.props.onUpdate
    );
  }

  toggleCollapse(target) {
    const line = this.state.line;
    line[target] = !line[target];
    this.setState(
      {
        line,
      },
      this.props.onUpdate
    );
  }

  render() {
    return (
      // DEPRECATE TEXT TO VOICE SOON
      <div className="multiline">
        <div className="multi-title-block">
          <div
            className="multi-title"
            onClick={() => {
              this.toggleCollapse('collapse');
            }}
          >
            <span className="text-muted">
              {this.state.line.collapse ? <i className="fas fa-caret-down" /> : <i className="fas fa-caret-right" />} {this.state.index + 1}
            </span>{' '}
            {this.state.line.title}
          </div>
          <Button
            isClose
            onClick={() => {
              this.props.onRemove(this.state.index);
            }}
          />
        </div>
        <Collapse isOpen={this.state.line.collapse}>
          <AudioDrop
            audio={this.state.line.audio}
            update={(audio) => {
              const line = this.state.line;
              line.audio = audio;
              this.setState({ line }, this.props.newAudio);
            }}
          />
          {this.state.line.text && this.state.line.textCollapse !== undefined ? (
            <div className="text-to-voice">
              <div className="subtitle" onClick={() => this.toggleCollapse('textCollapse')}>
                Text to Speech {this.state.line.textCollapse ? <i className="fas fa-caret-down" /> : <i className="fas fa-caret-right" />}
              </div>
              <Collapse isOpen={this.state.line.textCollapse}>
                <div className="textarea-collapse">
                  <Textarea
                    name="text"
                    value={this.state.line.text}
                    onChange={this.handleChange}
                    minRows={2}
                    placeholder="Enter text you want to convert here"
                  />
                  <div className="btn-group w-100">
                    <Select
                      classNamePrefix="select-box"
                      placeholder="Select Voice"
                      className="select-box"
                      value={this.state.line.voice ? { label: this.state.line.voice, value: this.state.line.voice } : null}
                      onChange={this.handleSelection}
                      options={
                        Array.isArray(this.state.voices)
                          ? this.state.voices.map((voice) => {
                              return { label: voice.Name, value: voice.Id, target: 'voice' };
                            })
                          : null
                      }
                    />
                    <Button isBtn isPrimary onClick={onGenerate}>
                      Generate
                    </Button>
                  </div>
                </div>
              </Collapse>
            </div>
          ) : null}
          <div className="pt-3" />
        </Collapse>
        <hr />
      </div>
    );
  }
}

export default MultiLineInput;
