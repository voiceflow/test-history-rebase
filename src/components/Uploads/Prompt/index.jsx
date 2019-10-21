import { constants } from '@voiceflow/common';
import { clone } from 'lodash';
import React, { PureComponent } from 'react';
import Select from 'react-select';
import Textarea from 'react-textarea-autosize';

import ButtonGroup from '@/components/ButtonGroup';
import AudioDrop from '@/components/Uploads/AudioDrop';
import VariableText from '@/components/VariableText';

import { PromptContainer } from './components';

const VOICES = constants.voices;

const PromptType = {
  TEXT: 'text',
  AUDIO: 'audio',
};

const TABS = [
  {
    label: 'Text',
    value: PromptType.TEXT,
  },
  {
    label: 'Audio',
    value: PromptType.AUDIO,
  },
];

class Prompt extends PureComponent {
  constructor(props) {
    super(props);

    this.voice = this.props.voice_id ? this.props.voice_id : 'voice';
    this.content = this.props.content_id ? this.props.content_id : 'content';

    this.selectVoice = this.selectVoice.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.renderTab = this.renderTab.bind(this);
    this.switchTab = this.switchTab.bind(this);
    this.local_save = null;

    if (!props.voice) {
      props.updatePrompt({
        [this.voice]: 'Alexa',
        [this.content]: '',
      });

      this.state = {
        tab: PromptType.TEXT,
      };
    } else {
      this.state = {
        tab: props.voice === PromptType.AUDIO ? PromptType.AUDIO : PromptType.TEXT,
      };
    }
  }

  switchTab(tab) {
    if (tab !== this.state.tab) {
      this.setState({
        tab,
      });

      const copy = clone(this.local_save);
      this.local_save = {
        [this.voice]: this.props.voice,
        [this.content]: this.props.content,
      };

      if (copy) {
        this.props.updatePrompt(copy);
      } else {
        this.props.updatePrompt({
          [this.voice]: tab === PromptType.AUDIO ? PromptType.AUDIO : 'Alexa',
          [this.content]: '',
        });
      }
    }
  }

  updateContent(content) {
    this.props.updatePrompt({
      [this.content]: content,
    });
  }

  selectVoice(selected) {
    this.props.updatePrompt({
      [this.voice]: selected.value,
    });
  }

  renderTab() {
    if (this.props.voice === PromptType.AUDIO) {
      return (
        <div className="multiline mb-3">
          <div className="mb-3">
            <AudioDrop audio={this.props.content} update={this.updateContent} />
          </div>
        </div>
      );
    }
    return (
      <div className="multiline">
        <div className="multi-title-block mb-2">
          <div className="super-center flex-hard">
            Speaking As
            <Select
              className="speak-box ml-3"
              classNamePrefix="select-box"
              value={{ label: this.props.voice, value: this.props.voice }}
              onChange={this.selectVoice}
              options={VOICES}
              maxMenuHeight={120}
            />
          </div>
        </div>
        {this.props.variables ? (
          <VariableText
            className="editor form-control auto-height"
            raw={this.props.content}
            placeholder={this.props.placeholder}
            variables={this.props.variables}
            updateRaw={this.updateContent}
          />
        ) : (
          <Textarea
            minRows={3}
            placeholder={this.props.placeholder}
            className="form-control"
            value={this.props.content}
            onChange={(e) => this.updateContent(e.target.value)}
          />
        )}
      </div>
    );
  }

  render() {
    return (
      <PromptContainer>
        <ButtonGroup selected={this.state.tab} options={TABS} onChange={this.switchTab} />
        <div className="mt-2">{this.renderTab()}</div>
      </PromptContainer>
    );
  }
}

export default Prompt;
