import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import _ from 'lodash';
import React, { Component } from 'react';
import styled from 'styled-components';

import DraftJSEditor from '@/components/DraftJSEditor';
import { InlineVariableTag } from '@/components/VariableTag';

import Menu from './Menu';
import Recent from './Recent';
import Speaker from './Speaker';
import Voice from './Voice';
import createEntityStore from './entityStore';
import createTagPlugin from './tagPlugin';
import { wrapVoice } from './tagUtil';

export const Container = styled.div`
  background: #ffffff;
  border: 1px solid #d4d9e6;
  box-shadow: 0px 1px 3px rgba(17, 49, 96, 0.06);
  border-radius: 5px;
  width: 376px;
  /* padding: 15px 20px 0px 20px !important; */
  word-break: break-all;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:focus,
  &:focus-within {
    border: 1px solid #42a5ff !important;
  }

  & > .DraftEditor-root {
    padding: 15px 20px !important;
    min-height: 88px !important;
  }

  & > .DraftEditor-root .public-DraftEditor-content div {
    display: inline;
  }

  & > .DraftEditor-root .public-DraftEditor-content br {
    display: none;
  }

  & > .DraftEditor-root figure {
    display: inline-block;
    margin: 0;
  }

  & > .DraftEditor-editorContainer,
  .DraftEditor-root,
  .public-DraftEditor-content {
    min-height: 88px !important; /* click the editor starts input */
  }
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 20px !important;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
`;

const Divider = styled.hr`
  margin-bottom: 0px;
  margin-top: 0px;
`;

class SSMLEditor extends Component {
  constructor(props) {
    super(props);
    this.mentionPlugin = createMentionPlugin({
      supportWhitespace: false,
      theme: {
        mentionSuggestions: 'mentionSuggestions',
        mentionSuggestionsEntry: 'mentionSuggestionsEntry',
        mentionSuggestionsEntryFocused: 'mentionSuggestionsEntryFocused',
        mentionSuggestionsEntryText: 'mentionSuggestionsEntryText',
      },
      entityMutability: 'IMMUTABLE',
      mentionTrigger: '{',
      mentionRegExp: '[\\w_-]*',
      mentionPrefix: '{',
      mentionSuffix: '}',
      mentionComponent: (mentionProps) => <InlineVariableTag>{mentionProps.children}</InlineVariableTag>,
    });

    const { value, variables = [] } = props;
    const { raw, store, voice } = value || {};

    this.state = {
      editorState: value && raw ? EditorState.createWithContent(convertFromRaw(raw)) : EditorState.createEmpty(),
      suggestions: variables.map((v) => {
        return { name: v };
      }),
      recent: [],
      voice: voice || 'Alexa',
      text: '',
    };

    this.entityStore = createEntityStore(store);
    this.tagPlugin = createTagPlugin(this.entityStore);
  }

  onSearchChange = ({ value }) => {
    const { variables = [] } = this.props;
    this.setState({
      suggestions: defaultSuggestionsFilter(value, variables.map((v) => ({ name: v }))),
    });
  };

  forwardChange = () => {
    const { editorState, voice, text } = this.state;
    const payload = {
      raw: convertToRaw(editorState.getCurrentContent()),
      store: this.entityStore.exportStore(),
      voice,
      text: wrapVoice(voice, text),
    };
    this.props.onChange && this.props.onChange(payload);
  };

  onChange = (editorState) => {
    this.setState(
      {
        editorState,
        text: editorState
          .getCurrentContent()
          .getBlockMap()
          .map((block) => {
            return block ? block.getText() : '';
          })
          .join(''),
      },
      this.forwardChange
    );
  };

  changeVoice = (voice) => {
    this.setState(
      {
        voice,
      },
      this.forwardChange
    );
  };

  useTag = (data, skip = false) => {
    if (!skip) {
      this.setState((state) => {
        const history = [data, ...state.recent];
        if (history.length > 9) history.pop();
        return {
          recent: history,
        };
      });
    }
    if (data.VF_void) {
      this.tagPlugin.insertEntity(data);
    } else {
      this.tagPlugin.addEntity(data);
    }
  };

  render() {
    const { MentionSuggestions } = this.mentionPlugin;
    const plugins = [this.entityStore.first, this.mentionPlugin, this.tagPlugin, this.entityStore.last];
    const { setError } = this.props;

    return (
      <Container>
        <DraftJSEditor
          wordBreak="break-all"
          plugins={plugins}
          editorState={this.state.editorState}
          onChange={this.onChange}
          placeholder={this.props.placeholder ? this.props.placeholder : 'Enter Text Here'}
          stripPastedStyles={true}
        />
        <MentionSuggestions onSearchChange={this.onSearchChange} suggestions={this.state.suggestions} onAddMention={_.noop} />
        <div>
          <Divider />
          <Bottom>
            <Section>
              <Speaker ssml={this.state.text} voice={this.state.voice} setError={setError} />
              <Voice voice={this.state.voice} onChange={this.changeVoice} />
            </Section>
            <Section>
              <Recent history={this.state.recent} onClick={this.useTag} />
              <Menu onClick={this.useTag} />
            </Section>
          </Bottom>
        </div>
      </Container>
    );
  }
}

export default SSMLEditor;
